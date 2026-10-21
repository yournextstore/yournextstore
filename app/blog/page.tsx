import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { BreadcrumbBar, ListingTitle } from "@/components/listing";
import { PostCard } from "@/components/sections/home";
import { commerce, getCanonicalUrl, getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { isStoreToolEnabled } from "@/lib/store-tools";

const POSTS_LIMIT = 24;

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `News, guides, and stories from ${storeName}.`;

	return {
		title: "Blog",
		description,
		alternates: { canonical: "/blog" },
		openGraph: {
			type: "website",
			title: "Blog",
			description,
			url: "/blog",
		},
	};
}

export default async function BlogPage() {
	"use cache";
	cacheLife("minutes");

	if (!(await isStoreToolEnabled("blog"))) {
		notFound();
	}

	const { data: posts } = await commerce.postBrowse({ active: true, limit: POSTS_LIMIT });
	const baseUrl = getCanonicalUrl();

	const blogJsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "Blog",
		url: `${baseUrl}/blog`,
		blogPost: posts.map((post) => ({
			"@type": "BlogPosting",
			headline: post.title,
			url: `${baseUrl}/blog/${post.slug}`,
			datePublished: post.publishedAt ?? post.createdAt,
			...(post.image ? { image: post.image } : {}),
		})),
	};

	return (
		<div className="min-h-svh">
			<JsonLdScript data={blogJsonLd} />
			<BreadcrumbBar items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
			<ListingTitle
				lead="Our"
				title="Journal."
				subtitle="Stay up to date with the latest news and insights"
			/>
			<div className="shell">
				{posts.length === 0 ? (
					<div className="py-16 text-center">
						<p className="text-sm/6 uppercase text-muted-foreground">No posts yet. Check back soon.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
						{posts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
