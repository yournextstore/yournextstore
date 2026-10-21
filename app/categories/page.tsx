import type { Metadata } from "next";
import { BrowseCards } from "@/components/browse-cards";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
	title: "Categories",
	alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
	const categories = await getCategories();
	return (
		<BrowseCards
			kicker="Browse"
			title="Categories"
			items={categories.map((category) => ({
				id: category.id,
				name: category.name,
				description: category.description,
				href: `/category/${category.slug}`,
			}))}
		/>
	);
}
