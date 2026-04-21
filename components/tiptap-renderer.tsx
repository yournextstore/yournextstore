import type { JSONContent as TiptapJSONContent } from "@tiptap/core";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color, FontFamily, FontSize, LineHeight, TextStyle } from "@tiptap/extension-text-style";
import { Youtube } from "@tiptap/extension-youtube";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer";
import type { JSONContent } from "commerce-kit";

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
];

export function TiptapRenderer({ content }: { content: JSONContent | null | undefined }) {
	if (!content) return null;
	const children = (content as TiptapJSONContent).content;
	if (!Array.isArray(children) || children.length === 0) return null;
	try {
		return <>{renderToReactElement({ content: content as TiptapJSONContent, extensions })}</>;
	} catch (error) {
		console.error("TiptapRenderer failed to render content", error);
		return null;
	}
}
