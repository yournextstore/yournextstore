import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { try_ } from "safe-try";
import { getAllLegalPages, slugParams } from "@/lib/catalog-paths";
import { commerce, getStoreSeo } from "@/lib/commerce";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const { slug } = await params;
	const page = await getLegalPage(slug);

	if (!page) {
		return { title: "Page Not Found", robots: { index: false, follow: true } };
	}

	const canonical = `/legal${page.href}`;
	const { storeName } = await getStoreSeo();

	return {
		title: page.label,
		description: `Read the ${page.label} for ${storeName}.`,
		alternates: { canonical },
		openGraph: {
			type: "article",
			title: page.label,
			url: canonical,
		},
	};
}

// Every known address prerenders in full; one added later renders on its first visit (lib/catalog-paths.ts).
export const generateStaticParams = () =>
	slugParams(getAllLegalPages(), (page) => page.path.split("/").filter(Boolean).at(-1) ?? "");

// The SDK throws on a 404. Without the null, the `!page` branches never run and an
// unknown slug answers 200 with the error page.
const getLegalPage = async (slug: string) => {
	"use cache";
	cacheLife("hours");
	const [error, page] = await try_(commerce.legalPageGet(slug));
	return error ? null : page;
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const page = await getLegalPage(slug);

	if (!page) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-3xl font-bold tracking-tight mb-8">{page.label}</h1>
			{page.contentHtml ? (
				<div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
			) : (
				<p className="text-muted-foreground">No content available.</p>
			)}
		</div>
	);
}
