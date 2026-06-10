import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { YnsLink } from "@/components/yns-link";
import { commerce, getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { LOCALE } from "@/lib/constants";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

async function isBlogEnabled(): Promise<boolean> {
	try {
		const me = await meGetCached();
		return me.store.settings?.enabledTools?.blog ?? false;
	} catch {
		return false;
	}
}

function formatDate(value: string): string {
	return new Date(value).toLocaleDateString(LOCALE, { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const post = await commerce.postGet({ idOrSlug: slug });

	if (!post) {
		return { title: "Post Not Found", robots: { index: false, follow: true } };
	}

	const seoTitle = post.seo?.title || post.title;
	const seoDescription = post.seo?.description || undefined;
	const canonical = post.seo?.canonical || `/blog/${post.slug}`;

	return {
		title: seoTitle,
		description: seoDescription,
		alternates: { canonical },
		openGraph: {
			type: "article",
			title: seoTitle,
			description: seoDescription,
			url: canonical,
			publishedTime: post.publishedAt ?? post.createdAt,
			images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
		},
		twitter: {
			card: post.image ? "summary_large_image" : "summary",
			title: seoTitle,
			description: seoDescription,
			images: post.image ? [post.image] : undefined,
		},
	};
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("minutes");

	if (!(await isBlogEnabled())) {
		notFound();
	}

	const { slug } = await props.params;
	const post = await commerce.postGet({ idOrSlug: slug });

	if (!post?.active) {
		notFound();
	}

	const baseUrl = getCanonicalUrl();
	const publishedAt = post.publishedAt ?? post.createdAt;

	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		url: `${baseUrl}/blog/${post.slug}`,
		datePublished: publishedAt,
		dateModified: post.updatedAt,
		...(post.image ? { image: post.image } : {}),
		...(post.seo?.description ? { description: post.seo.description } : {}),
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
			{ "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
			{ "@type": "ListItem", position: 3, name: post.title },
		],
	};

	return (
		<article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={articleJsonLd} />
			<JsonLdScript data={breadcrumbJsonLd} />

			{/* Header */}
			<div className="mb-8">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/blog">Blog</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="line-clamp-1">{post.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
					{post.tag && (
						<span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">
							{post.tag}
						</span>
					)}
					<time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
				</div>
				<h1 className="mt-4 text-4xl font-medium tracking-tight text-balance">{post.title}</h1>
			</div>

			{/* Cover image */}
			{post.image && (
				<div className="relative aspect-[3/2] bg-secondary rounded-2xl overflow-hidden mb-10">
					<YNSMedia
						src={post.image}
						alt={post.title}
						fill
						priority
						sizes="(max-width: 768px) 100vw, 768px"
						className="object-cover"
					/>
				</div>
			)}

			{/* Content */}
			<div className="prose prose-sm dark:prose-invert max-w-none">
				<TiptapRenderer content={post.content} />
			</div>

			{/* Footer nav */}
			<div className="mt-16 border-t border-border pt-8">
				<YnsLink
					prefetch="eager"
					href="/blog"
					className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					← Back to blog
				</YnsLink>
			</div>
		</article>
	);
}
