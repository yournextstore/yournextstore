import { cacheLife } from "next/cache";
import type { NavLink } from "@/app/navbar";
import { commerce, meGetCached } from "@/lib/commerce";

export type NavData = {
	storeName: string;
	storeDescription: string | null;
	shopLinks: NavLink[];
	links: NavLink[];
	secondary: NavLink[];
};

export async function getNavData(): Promise<NavData> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const rootCategories = categories.data.filter((category) => !category.parentId);
	const storeName = me?.store.settings?.storeName || me?.store.name || "Store";
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	const contactEnabled = me?.store.settings?.enabledTools?.contactForm ?? false;
	// Categories drive the menu, as in the original; a store without any falls back to collections.
	const shopLinks =
		rootCategories.length > 0
			? rootCategories.map((category) => ({ href: `/category/${category.slug}`, label: category.name }))
			: collections.data
					.filter((collection) => collection.productCollections.length > 0)
					.map((collection) => ({
						href: `/collection/${collection.slug}`,
						label: collection.name,
					}));
	return {
		storeName,
		storeDescription: me?.store.settings?.storeDescription || null,
		shopLinks,
		links: [{ href: "/", label: "Home" }, { href: "/products", label: "All Products" }, ...shopLinks],
		secondary: [
			{ href: "/about", label: "About" },
			...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
			{ href: "/faq", label: "FAQ" },
			...(contactEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		],
	};
}
