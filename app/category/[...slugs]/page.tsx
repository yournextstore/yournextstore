import { Suspense } from "react";
import { CategoryView, categoryMetadata } from "@/app/category/[...slugs]/category-view";
import { SearchParamsProbe } from "@/components/search-params-probe";
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

// Listed addresses still prerender in full (the boundary resolves at build time, so no fallback shows). An address
// added later streams in behind the prerendered chrome, so `notFound()` there renders the not-found page inside the
// layout instead of a bare error document.
export default function CategoryPage(props: Parameters<typeof CategoryPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<CategoryPageContent {...props} />
		</Suspense>
	);
}

async function CategoryPageContent(props: PageProps<"/category/[...slugs]">) {
	const { slugs } = await props.params;
	return (
		<>
			<SearchParamsProbe searchParams={props.searchParams} />
			<CategoryView slugs={slugs} filters={{}} />
		</>
	);
}
