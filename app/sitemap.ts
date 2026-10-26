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

// Cached, so the sitemap is prerendered and refreshed hourly instead of walking the whole catalog on every crawl
// (the lists come from lib/catalog-paths.ts). `now` is read inside the cache scope, which is what lets it prerender.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	"use cache";
	cacheLife("hours");

	const baseUrl = getCanonicalUrl();
	const now = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
		{ url: `${baseUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
	];

	const [products, collections, categories, legalPages, blog, contactFormEnabled] = await Promise.all([
		getAllProducts().catch(() => []),
		getAllCollections().catch(() => []),
		getAllCategories().catch(() => []),
		getAllLegalPages().catch(() => []),
		getBlogState().catch(() => ({ enabled: false, posts: [] })),
		getContactFormEnabled().catch(() => false),
	]);

	if (contactFormEnabled) {
		staticRoutes.push({
			url: `${baseUrl}/contact`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.5,
		});
	}

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
				{ url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
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
