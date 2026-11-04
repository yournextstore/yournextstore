import { Suspense } from "react";
import { CategoryView, categoryMetadata } from "@/app/category/[...slugs]/category-view";
import { getAllCategories, isStaticSlug, PLACEHOLDER_SLUG, withPlaceholder } from "@/lib/catalog-paths";

// Known categories prerender in full (lib/catalog-paths.ts). This route never reads the query: filters and pages go
// through `/category-filtered/…` (lib/listing-routes.ts), so the default view stays static.
export async function generateStaticParams() {
	const categories = await getAllCategories().catch(() => []);
	const paths = categories
		.map((category) => category.path.split("/").filter(Boolean))
		.filter((path) => path.length > 0 && path.every(isStaticSlug));
	return withPlaceholder(paths, [PLACEHOLDER_SLUG]).map((slugs) => ({ slugs }));
}

export async function generateMetadata(props: PageProps<"/category/[...slugs]">) {
	const { slugs } = await props.params;
	return categoryMetadata(slugs);
}

// An address added after the build renders in full on its first request before anything is sent, so a missing one
// answers 404 with the not-found page inside the layout, not a 200 behind an already-sent shell (AGENTS.md). It also
// rules out reading the query here; a client-side visit to a filtered or paged URL still reaches the server.
export const ensureStatic = "navigation";

// Listed addresses prerender in full: the boundary resolves at build time, so no fallback ever shows.
export default function CategoryPage(props: Parameters<typeof CategoryPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<CategoryPageContent {...props} />
		</Suspense>
	);
}

async function CategoryPageContent(props: PageProps<"/category/[...slugs]">) {
	const { slugs } = await props.params;
	return <CategoryView slugs={slugs} filters={{}} />;
}
