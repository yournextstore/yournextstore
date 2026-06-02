import type { MetadataRoute } from "next";
import { commerce, getCanonicalUrl, meGetCached } from "@/lib/commerce";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

async function getAllProducts() {
	const products: { slug: string; updatedAt: string; images: string[] }[] = [];
	for (let page = 0; page < MAX_PAGES; page++) {
		const result = await commerce.productBrowse({
			active: true,
			limit: PAGE_SIZE,
			offset: page * PAGE_SIZE,
		});
		products.push(...result.data.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt, images: p.images })));
		if (result.data.length < PAGE_SIZE) break;
	}
	return products;
}

async function getAllCollections() {
	const result = await commerce.collectionBrowse({ active: true, limit: 200 });
	return result.data.map((c) => ({ slug: c.slug, lastModified: c.createdAt }));
}

async function getAllLegalPages() {
	const result = await commerce.legalPageBrowse();
	return result.data.map((p) => ({ path: p.path, updatedAt: p.updatedAt }));
}

async function getContactFormEnabled() {
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.enabledTools?.contactForm ?? false;
}

async function getBlogState() {
	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return { enabled: false, posts: [] as { slug: string; lastModified: string }[] };
	}
	const result = await commerce.postBrowse({ active: true, limit: 200 }).catch(() => ({ data: [] }));
	return {
		enabled: true,
		posts: result.data.map((p) => ({ slug: p.slug, lastModified: p.publishedAt ?? p.createdAt })),
	};
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getCanonicalUrl();
	const now = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
		{ url: `${baseUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
	];

	const [products, collections, legalPages, blog, contactFormEnabled] = await Promise.all([
		getAllProducts().catch(() => []),
		getAllCollections().catch(() => []),
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

	return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...legalRoutes, ...blogRoutes];
}
