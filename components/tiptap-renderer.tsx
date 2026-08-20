import { type JSONContent as TiptapJSONContent, Node as TiptapNode } from "@tiptap/core";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color, FontFamily, FontSize, LineHeight, TextStyle } from "@tiptap/extension-text-style";
import { Youtube } from "@tiptap/extension-youtube";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer";
import type { JSONContent } from "commerce-kit";
import type { ReactNode } from "react";
import { BlogProductEmbed } from "@/components/blog-product-embed";

// The admin editor writes images as `imageResize`. Alias it onto Image rather than pull the
// editor-only dependency into the storefront.
const ImageResize = Image.extend({ name: "imageResize" });

// The admin editor's featured-products block, declared for the same reason as the image alias.
// A leaf: the products are rendered from `productIds`, it has no child content.
const ProductEmbed = TiptapNode.create({
	name: "productEmbed",
	group: "block",
	addAttributes: () => ({ productIds: { default: [] as string[] } }),
	parseHTML: () => [{ tag: "div[data-type='product-embed']" }],
	renderHTML: () => ["div", { "data-type": "product-embed" }],
});

const extensions = [
	StarterKit.configure({
		link: {
			openOnClick: false,
			autolink: false,
			defaultProtocol: "https",
			protocols: ["http", "https"],
		},
	}),
	TextStyle,
	LineHeight,
	FontFamily,
	Color.configure({ types: ["textStyle"] }),
	TextAlign.configure({
		types: ["heading", "paragraph"],
		alignments: ["left", "center", "right"],
		defaultAlignment: "left",
	}),
	FontSize,
	Youtube.configure({}),
	Image.configure({ allowBase64: false, inline: true }),
	ImageResize.configure({ allowBase64: false, inline: true }),
	ProductEmbed,
];

type Node = TiptapJSONContent;

/** True if a node carries any actual rendered text/media (recursively). */
function hasMeaningfulContent(node: Node | undefined | null): boolean {
	if (!node) return false;
	if (typeof node.text === "string" && node.text.trim().length > 0) return true;
	// Self-contained media nodes count as meaningful even without text children.
	if (
		node.type &&
		["image", "imageResize", "youtube", "horizontalRule", "hardBreak", "productEmbed"].includes(node.type)
	) {
		return true;
	}
	if (Array.isArray(node.content)) {
		return node.content.some(hasMeaningfulContent);
	}
	return false;
}

function isListType(node: Node | undefined | null): boolean {
	return Boolean(node && (node.type === "bulletList" || node.type === "orderedList"));
}

/**
 * Prune empty TipTap structures from already-loaded product content:
 *  (a) listItems whose only content is empty paragraph(s) with no text,
 *  (b) bulletList/orderedList left with zero items,
 *  (c) a heading immediately followed by such a now-empty/removed list
 *      (drops the orphan "Features" heading too).
 */
// Node types that may hold INLINE content only. A block nested inside one renders as
// `<p><p>…</p></p>`, which React rejects at hydration ("<p> cannot be a descendant of <p>").
const INLINE_ONLY_NODES = new Set(["paragraph", "heading"]);
const INLINE_NODE_TYPES = new Set(["text", "hardBreak", "image"]);

/**
 * Lift block nodes out of inline-only parents.
 *
 * Source HTML nests blocks inside inline tags (`<b><p>Title</p></b>`), and a store whose catalogue
 * was imported before the transform-side fix still has that shape stored server-side — 813 of
 * 4motos.pl's products did. Normalizing here keeps those product pages hydration-clean without
 * re-importing: inline children stay put and block children are hoisted beside the parent, in
 * document order.
 */
function liftNestedBlocks(nodes: Node[]): Node[] {
	const out: Node[] = [];
	for (const node of nodes) {
		if (!node) continue;
		const children = node.content ? liftNestedBlocks(node.content) : undefined;
		if (!children || !node.type || !INLINE_ONLY_NODES.has(node.type)) {
			out.push(children ? { ...node, content: children } : node);
			continue;
		}
		let run: Node[] = [];
		const flushRun = () => {
			if (run.length) out.push({ ...node, content: run });
			run = [];
		};
		for (const child of children) {
			if (child.type && INLINE_NODE_TYPES.has(child.type)) run.push(child);
			else {
				flushRun();
				out.push(child);
			}
		}
		if (run.length) flushRun();
	}
	return out;
}

function pruneEmptyNodes(nodes: Node[]): Node[] {
	const cleaned: { node: Node; origNextWasList: boolean }[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (!node) continue;
		const child = node.content ? pruneEmptyNodes(node.content) : undefined;
		const next: Node = child ? { ...node, content: child } : node;

		if (next.type === "listItem" && !hasMeaningfulContent(next)) continue; // (a)
		if (isListType(next) && (!next.content || next.content.length === 0)) continue; // (b)

		cleaned.push({ node: next, origNextWasList: isListType(nodes[i + 1]) });
	}

	const result: Node[] = [];
	for (let i = 0; i < cleaned.length; i++) {
		const entry = cleaned[i];
		if (!entry) continue;
		const { node, origNextWasList } = entry;
		if (node.type === "heading" && origNextWasList && !isListType(cleaned[i + 1]?.node)) {
			continue; // orphaned section heading like "Features"
		}
		result.push(node);
	}
	return result;
}

/**
 * Typography the store's design system owns, which pasted content routinely carries as inline
 * styles. Copying an article out of Word/Google Docs/an old CMS brings the *source's* font stack
 * along, so a single paragraph renders in Helvetica inside an otherwise serif page. The store
 * decides the typeface and the type scale; text colour is left alone because merchants do apply
 * it deliberately from the editor toolbar.
 */
const OVERRIDDEN_TEXT_STYLES = ["fontFamily", "fontSize"] as const;

function stripPastedTypography(nodes: Node[]): Node[] {
	return nodes.map((node) => {
		const marks = node.marks?.map((mark) => {
			if (mark.type !== "textStyle" || !mark.attrs) return mark;
			const attrs = { ...mark.attrs };
			for (const attr of OVERRIDDEN_TEXT_STYLES) delete attrs[attr];
			return { ...mark, attrs };
		});
		return {
			...node,
			...(marks ? { marks } : {}),
			...(node.content ? { content: stripPastedTypography(node.content) } : {}),
		};
	});
}

// Passed as `unhandledNode`/`unhandledMark`: without them a node or mark with no matching
// extension makes the whole render throw and the article comes out blank.
function passThrough({ children }: { children?: ReactNode | ReactNode[] }): ReactNode {
	return children ?? null;
}

export function TiptapRenderer({ content }: { content: JSONContent | null | undefined }) {
	if (!content) return null;
	const root = content as TiptapJSONContent;
	const children = root.content;
	if (!Array.isArray(children) || children.length === 0) return null;

	const prunedChildren = pruneEmptyNodes(liftNestedBlocks(stripPastedTypography(children)));
	if (prunedChildren.length === 0) return null;
	const pruned: TiptapJSONContent = { ...root, content: prunedChildren };

	return (
		<>
			{renderToReactElement({
				content: pruned,
				extensions,
				options: {
					nodeMapping: {
						productEmbed: ({ node }) => {
							const ids = node.attrs.productIds;
							return Array.isArray(ids) ? (
								<BlogProductEmbed productIds={ids.filter((id) => typeof id === "string")} />
							) : null;
						},
					},
					unhandledNode: passThrough,
					unhandledMark: passThrough,
				},
			})}
		</>
	);
}
