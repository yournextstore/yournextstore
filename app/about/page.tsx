import type { Metadata } from "next";
import { Incentives } from "@/components/sections/incentives";
import { ProductFeatures } from "@/components/sections/product-features";
import { PromoBand } from "@/components/sections/promo-band";
import { getStoreIdentity } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { EDITORIAL } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName}: our story, our values, and the people behind the shop.`;

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
	const { storeName, storeDescription } = await getStoreIdentity();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? "Our story, our values, and the people behind the shop.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<div className="container-ae pt-10 sm:pt-12">
				<PromoBand
					rounded
					headingLevel={1}
					title={`About ${storeName}`}
					text={
						storeDescription ??
						"A small womenswear label making the knits, shirts, trousers and coats we want to wear every day."
					}
					cta="Browse the shop"
					href="/products"
					images={EDITORIAL.aboutBand}
				/>
			</div>

			<ProductFeatures
				title="Our story"
				lead="It started with a simple idea: fewer, better clothes."
				heading="What we believe in"
				description="We only make a piece when we would wear it ourselves, week after week. That means a smaller range in natural fibres, in colours that work together."
				points={[
					"Natural fibres: merino, lambswool, cotton, linen and wool.",
					"Simple cuts: shapes that layer and mix across the range.",
					"Honest information: fabric, weight and fit for every piece.",
				]}
				images={EDITORIAL.aboutStory}
			/>

			<Incentives />
		</>
	);
}
