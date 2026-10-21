import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { EditorialBlock } from "@/components/photon";
import { editorialImages, getStoreIdentity } from "@/lib/catalog";
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

async function AboutContent() {
	"use cache";
	cacheLife("hours");

	const identity = await getStoreIdentity();
	const { storeName, storeDescription, contactFormEnabled } = identity;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `About ${storeName}: what we sell and why.`,
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<EditorialBlock className="bg-photon-green text-white">
				<h1 className="text-photon-title">Just the start</h1>
				<p>
					{storeName} began with a handful of things we wanted to use ourselves: useful, made well, with a bit
					of colour.
				</p>
				<p>
					{storeDescription ??
						"We keep the range small and photograph everything plainly, so what you see is what you get."}
				</p>
			</EditorialBlock>
			<EditorialBlock className="bg-black text-white" image={editorialImages.about.src}>
				<h2 className="text-photon-title">{storeName}</h2>
				<p>Lamps, stools, trays and clocks in steel and acrylic, in loud solid colour.</p>
				<p className="flex flex-wrap gap-x-[var(--main-gap)]">
					<Link href="/products" className="inline-flex min-h-6 items-center">
						All Products ↗
					</Link>
					<Link href="/faq" className="inline-flex min-h-6 items-center">
						FAQ ↗
					</Link>
					{contactFormEnabled && (
						<Link href="/contact" className="inline-flex min-h-6 items-center">
							Contact ↗
						</Link>
					)}
				</p>
			</EditorialBlock>
		</>
	);
}

export default function AboutPage() {
	return <AboutContent />;
}
