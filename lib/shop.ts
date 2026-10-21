import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";

export type ShelfLink = { href: string; label: string };

export type ShopInfo = {
	storeName: string;
	description: string | null;
	contactForm: boolean;
	blog: boolean;
	socials: ShelfLink[];
	email: string | null;
};

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
} as const;

/** Store identity and the switches the chrome reads (cached, so the header stays in the shell). */
export async function getShopInfo(): Promise<ShopInfo> {
	"use cache";
	cacheLife("hours");
	const [meError, me] = await try_(meGetCached());
	const [socialError, socials] = await try_(commerce.socialsGet());
	const settings = meError ? null : me.store.settings;
	const storeName = settings?.storeName || (meError ? "" : me.store.name) || "Our Store";
	const links = socialError
		? []
		: Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const url = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return url ? [{ href: url, label }] : [];
			});
	return {
		storeName,
		description: settings?.storeDescription || null,
		contactForm: settings?.enabledTools?.contactForm ?? false,
		blog: settings?.enabledTools?.blog ?? false,
		socials: links,
		email: socialError ? null : socials.socials.email,
	};
}

/** Top-level categories and collections: the "shelves" of the Category menu and the home rows. */
export async function getShelves(): Promise<{ categories: ShelfLink[]; collections: ShelfLink[] }> {
	"use cache";
	cacheLife("hours");
	const [catError, categories] = await try_(commerce.categoriesBrowse({ active: true, limit: 50 }));
	const [colError, collections] = await try_(commerce.collectionBrowse({ limit: 12 }));
	return {
		categories: catError
			? []
			: categories.data
					.filter((c) => !c.parentId)
					.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
		collections: colError
			? []
			: collections.data
					// A manual collection without members opens an empty page, so it is never linked.
					.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
					.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
	};
}
