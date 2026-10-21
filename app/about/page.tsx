import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Crumbs } from "@/components/grilli/crumbs";
import { PageBanner } from "@/components/grilli/page-banner";
import { Quote } from "@/components/sections/quote";
import { Story } from "@/components/sections/story";
import { Strengths } from "@/components/sections/strengths";
import { getStoreBasics } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName} — our story, our values, and the people behind the products.`;

	return {
		title: "About Us",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About Us",
			description,
			url: "/about",
		},
	};
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, description } = await getStoreBasics();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: description ?? "Learn about our story, our values, and the people behind what we make.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<PageBanner kicker="Our Story" title="About Us" text={description}>
				<Crumbs trail={[{ href: "/", label: "Home" }]} current="About Us" />
			</PageBanner>
			<Story more={false} />
			<Quote />
			<Strengths />
		</>
	);
}
