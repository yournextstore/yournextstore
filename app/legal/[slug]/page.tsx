import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { commerce } from "@/lib/commerce";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const page = await commerce.legalPageGet(slug);

	if (!page) {
		return { title: "Page Not Found", robots: { index: false, follow: true } };
	}

	const canonical = `/legal${page.path}`;

	return {
		title: page.title,
		description: `${page.title} — read our policy and terms.`,
		alternates: { canonical },
		openGraph: {
			type: "article",
			title: page.title,
			url: canonical,
		},
	};
}

export default async function LegalPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("hours");

	const { slug } = await props.params;
	const page = await commerce.legalPageGet(slug);

	if (!page) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-3xl font-bold tracking-tight mb-8">{page.title}</h1>
			{page.content ? (
				<div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
			) : (
				<p className="text-muted-foreground">No content available.</p>
			)}
		</div>
	);
}
