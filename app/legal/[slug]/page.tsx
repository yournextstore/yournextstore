import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, getStoreSeo } from "@/lib/commerce";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const { slug } = await params;
	const page = await commerce.legalPageGet(slug);

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

function LegalPageSkeleton() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<Skeleton className="mb-8 h-9 w-64" />
			<div className="space-y-3">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-2/3" />
			</div>
		</div>
	);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function LegalPage(props: { params: Promise<{ slug: string }> }) {
	return (
		<Suspense fallback={<LegalPageSkeleton />}>
			<LegalPageContent params={props.params} />
		</Suspense>
	);
}

const getLegalPage = async (slug: string) => {
	"use cache";
	cacheLife("hours");
	return commerce.legalPageGet(slug);
};

const LegalPageContent = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
};
