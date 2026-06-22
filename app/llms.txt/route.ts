import { commerce, getCanonicalUrl, meGetCached } from "@/lib/commerce";

const FEATURED_PRODUCTS = 30;
const FEATURED_COLLECTIONS = 15;
const FEATURED_POSTS = 20;

export async function GET() {
	const baseUrl = getCanonicalUrl();
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || "An e-commerce store.";
	const blogEnabled = me.store.settings?.enabledTools?.blog ?? false;
	const contactFormEnabled = me.store.settings?.enabledTools?.contactForm ?? false;

	const [products, collections, legalPages, posts] = await Promise.all([
		commerce
			.productBrowse({ active: true, limit: FEATURED_PRODUCTS, orderBy: "createdAt", orderDirection: "desc" })
			.catch(() => ({ data: [] })),
		commerce.collectionBrowse({ active: true, limit: FEATURED_COLLECTIONS }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		blogEnabled
			? commerce.postBrowse({ active: true, limit: FEATURED_POSTS }).catch(() => ({ data: [] }))
			: Promise.resolve({ data: [] }),
	]);

	const sections: string[] = [];

	sections.push(`# ${storeName}`);
	sections.push("");
	sections.push(`> ${storeDescription}`);
	sections.push("");
	sections.push(
		`This is the AI-discovery index for ${storeName}. It lists the store's most relevant pages and products to help LLMs and AI search engines understand and cite the catalog.`,
	);
	sections.push("");

	sections.push("## Main pages");
	sections.push("");
	sections.push(`- [Home](${baseUrl}/): ${storeName} home page.`);
	sections.push(`- [All Products](${baseUrl}/products): Browse the complete product catalog.`);
	sections.push(`- [About Us](${baseUrl}/about): Our story, values, and the people behind ${storeName}.`);
	if (contactFormEnabled) {
		sections.push(`- [Contact Us](${baseUrl}/contact): Get in touch with the ${storeName} team.`);
	}
	sections.push(`- [FAQ](${baseUrl}/faq): Frequently asked questions about orders, shipping, and returns.`);
	if (blogEnabled) {
		sections.push(`- [Blog](${baseUrl}/blog): News, guides, and stories from ${storeName}.`);
	}
	sections.push("");

	if (collections.data.length > 0) {
		sections.push("## Collections");
		sections.push("");
		for (const c of collections.data) {
			sections.push(`- [${c.name}](${baseUrl}/collection/${c.slug}): ${c.name} collection.`);
		}
		sections.push("");
	}

	if (products.data.length > 0) {
		sections.push("## Featured products");
		sections.push("");
		for (const p of products.data) {
			const summary = p.summary?.trim() || `${p.name} — available at ${storeName}.`;
			sections.push(`- [${p.name}](${baseUrl}/product/${p.slug}): ${summary}`);
		}
		sections.push("");
	}

	if (posts.data.length > 0) {
		sections.push("## Blog posts");
		sections.push("");
		for (const p of posts.data) {
			sections.push(`- [${p.title}](${baseUrl}/blog/${p.slug})${p.tag ? `: ${p.tag}.` : "."}`);
		}
		sections.push("");
	}

	if (legalPages.data.length > 0) {
		sections.push("## Policies");
		sections.push("");
		for (const p of legalPages.data) {
			sections.push(`- [${p.label}](${baseUrl}/legal${p.href})`);
		}
		sections.push("");
	}

	const body = sections.join("\n");

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
		},
	});
}
