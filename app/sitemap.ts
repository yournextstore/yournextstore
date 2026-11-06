import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import {
	getAllCategories,
	getAllCollections,
	getAllLegalPages,
	getAllPosts,
	getAllProducts,
} from "@/lib/catalog-paths";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";

async function getContactFormEnabled() {
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.enabledTools?.contactForm ?? false;
}

async function getBlogState() {
	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return { enabled: false, posts: [] as { slug: string; lastModified: string }[] };
	}
	return { enabled: true, posts: await getAllPosts().catch(() => []) };
}

// The newest of a list's dates, or undefined for an empty list (the entry then has no <lastmod>).
function newest(dates: string[]) {
	const times = dates.map((date) => new Date(date).getTime()).filter((time) => !Number.isNaN(time));
	return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

// Cached, so the sitemap is prerendered and refreshed every minute or so instead of walking the whole catalog on every
// crawl (the lists come from lib/catalog-paths.ts, which keep the same lifetime: a renamed product must not keep its
// old address here for an hour). Every <lastmod> is a real date: a listing takes its newest entry's,
// and a page with no date of its own (about, FAQ, contact) has none. Google trusts lastmod only on a site where it's
// consistently accurate, so a page that claims to change on every regeneration costs the real dates too.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	"use cache";
	cacheLife("minutes");

	const baseUrl = getCanonicalUrl();

	const [products, collections, categories, legalPages, blog, contactFormEnabled] = await Promise.all([
		getAllProducts().catch(() => []),
		getAllCollections().catch(() => []),
		getAllCategories().catch(() => []),
		getAllLegalPages().catch(() => []),
		getBlogState().catch(() => ({ enabled: false, posts: [] })),
		getContactFormEnabled().catch(() => false),
	]);

	const catalogModified = newest(products.map((p) => p.updatedAt));

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${baseUrl}/`, lastModified: catalogModified, changeFrequency: "daily", priority: 1.0 },
		{ url: `${baseUrl}/products`, lastModified: catalogModified, changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
		...(contactFormEnabled
			? [{ url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.5 }]
			: []),
	];

	const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
		url: `${baseUrl}/product/${p.slug}`,
		lastModified: new Date(p.updatedAt),
		changeFrequency: "weekly",
		priority: 0.8,
		images: p.images.length > 0 ? p.images : undefined,
	}));

	const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
		url: `${baseUrl}/collection/${c.slug}`,
		lastModified: new Date(c.lastModified),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
		url: `${baseUrl}/category/${c.path}`,
		lastModified: new Date(c.lastModified),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const legalRoutes: MetadataRoute.Sitemap = legalPages.map((p) => ({
		url: `${baseUrl}/legal${p.path}`,
		lastModified: new Date(p.updatedAt),
		changeFrequency: "yearly",
		priority: 0.3,
	}));

	const blogRoutes: MetadataRoute.Sitemap = blog.enabled
		? [
				{
					url: `${baseUrl}/blog`,
					lastModified: newest(blog.posts.map((p) => p.lastModified)),
					changeFrequency: "weekly",
					priority: 0.6,
				},
				...blog.posts.map((p) => ({
					url: `${baseUrl}/blog/${p.slug}`,
					lastModified: new Date(p.lastModified),
					changeFrequency: "monthly" as const,
					priority: 0.5,
				})),
			]
		: [];

	return [
		...staticRoutes,
		...productRoutes,
		...collectionRoutes,
		...categoryRoutes,
		...legalRoutes,
		...blogRoutes,
	];
}
