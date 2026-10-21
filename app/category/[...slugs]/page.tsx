import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Archive } from "@/components/maison/archive";
import { ArchiveHero } from "@/components/maison/archive-hero";
import { ArchiveSkeleton } from "@/components/maison/archive-skeleton";
import { ActiveTab } from "@/components/maison/house-strip";
import { displayName, editorialShots, toPieces } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";

// The SDK loads the parent chain up to 2 levels deep (self -> parent -> grandparent),
// so the canonical path is capped at 3 segments (e.g. fashion/tops/t-shirts).
type CategoryLike = { name: string; slug: string; parent?: CategoryLike | null };

const flattenParents = (category: CategoryLike): Array<{ name: string; slug: string }> => {
	const parent = category.parent;
	return [...(parent ? flattenParents(parent) : []), { name: category.name, slug: category.slug }];
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slugs: string[] }>;
}): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slugs } = await params;
	const slug = slugs.at(-1);
	if (!slug) {
		return { title: "Category Not Found", robots: { index: false, follow: true } };
	}

	const category = await getCategoryData(slug);
	if (!category?.active) {
		return { title: "Category Not Found", robots: { index: false, follow: true } };
	}

	const canonicalPath = flattenParents(category as CategoryLike)
		.map((c) => c.slug)
		.join("/");
	const canonical = category.seo?.canonical || `/category/${canonicalPath}`;
	const title = category.seo?.title || category.name;
	const description = category.seo?.description || `Shop the ${category.name} category.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
			images: category.image ? [{ url: category.image, alt: category.name }] : undefined,
		},
		twitter: {
			card: category.image ? "summary_large_image" : "summary",
			title,
			description,
			images: category.image ? [category.image] : undefined,
		},
	};
}

async function getCategoryPieces(slug: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, category: slug, limit: 100, orderBy: "createdAt", orderDirection: "asc" })
		.catch(() => ({ data: [] }));
	return { pieces: await toPieces(data), shots: editorialShots(data) };
}

// Awaiting params at the top of the page blocks the static shell — the page stays a sync
// shell and the dynamic content streams inside Suspense.
export default function CategoryPage(props: { params: Promise<{ slugs: string[] }> }) {
	return (
		<Suspense fallback={<ArchiveSkeleton />}>
			<CategoryContent params={props.params} />
		</Suspense>
	);
}

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!category`
// branches never run and an unknown slug answers 200 with the error page.
const getCategoryData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, category] = await try_(commerce.categoryGet({ idOrSlug: slug }));
	return error ? null : category;
};

const CategoryContent = async ({ params }: { params: Promise<{ slugs: string[] }> }) => {
	const { slugs } = await params;
	const slug = slugs.at(-1);
	if (!slug) {
		notFound();
	}

	const category = await getCategoryData(slug);
	if (!category?.active) {
		notFound();
	}

	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}

	const { pieces, shots } = await getCategoryPieces(slug);
	const numbers = new Map(pieces.map((piece) => [piece.slug, piece.no]));
	const name = displayName(category.name);
	const description = typeof category.description === "string" ? category.description : null;

	return (
		<div className="mx-auto min-h-svh max-w-[1240px] px-4 sm:px-6">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ActiveTab tab={hierarchy[0]?.slug ?? slug} />
			<ArchiveHero
				kicker={
					hierarchy.length > 1
						? hierarchy
								.slice(0, -1)
								.map((crumb) => displayName(crumb.name))
								.join(" / ")
						: "Department"
				}
				title={name}
				blurb={
					description ??
					`${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"} filed under ${name.toLocaleLowerCase()}, each photographed and described in the register. Open a record for its full specification.`
				}
				tiles={shots.slice(0, 3).map((shot) => ({
					label: `No. ${numbers.get(shot.slug) ?? "—"}`,
					href: `/product/${shot.slug}`,
					src: shot.src,
				}))}
			/>
			<Archive pieces={pieces} showDepartments={false} />
		</div>
	);
};
