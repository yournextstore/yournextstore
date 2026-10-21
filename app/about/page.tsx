import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { PageShell, Section } from "@/components/bento/page-shell";
import { getCategoryTiles, inSentence } from "@/lib/aqua";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
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

async function getStoreInfo() {
	try {
		const me = await meGetCached();
		return {
			storeName: me.store.settings?.storeName || me.store.name || "our store",
			storeDescription: me.store.settings?.storeDescription || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return { storeName: "our store", storeDescription: null, contactFormEnabled: false };
	}
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	const categories = await getCategoryTiles();
	const named = categories.slice(0, 5).map((category) => inSentence(category.name));
	const range =
		named.length > 1 ? `${named.slice(0, -1).join(", ")} and ${named.at(-1)}` : (named[0] ?? "the catalogue");

	return (
		<PageShell
			eyebrow="About"
			title="Plants, light and stone for tanks that grow."
			intro={`${storeName} exists for one reason: a planted-aquarium range chosen on real specifications, not marketing copy. Every product is here because it earns its place.`}
		>
			<JsonLdScript data={aboutJsonLd} />
			{storeDescription ? (
				<Section>
					<p>{storeDescription}</p>
				</Section>
			) : null}
			<Section heading="Curated, not manufactured">
				<p>
					We don&apos;t manufacture. We curate. Every product here is chosen before it goes in the catalogue,
					and we tell you plainly what something is and what it isn&apos;t. No invented claims, no inflated
					spec sheets.
				</p>
				<p>
					Selection is based on measurable things: light output and spectrum, dimensions that fit real tanks,
					and how each plant grows and what light it needs.
				</p>
			</Section>
			<Section heading="For first-timers and fine-tuners">
				<p>
					Some people are setting up their first nano tank and want a straightforward pick. Others want to
					dial in light, CO2 and layout until the scape is unmistakably theirs. We stock for both.
				</p>
				<p>
					The range covers {range}. One place, no padding: browse{" "}
					<Link href="/products" className="text-amber underline-offset-4 hover:underline">
						all products
					</Link>{" "}
					or read the{" "}
					<Link href="/faq" className="text-amber underline-offset-4 hover:underline">
						frequently asked questions
					</Link>
					.
				</p>
			</Section>
			<Section heading="What every order includes">
				<p>
					Secure checkout with the payment methods you already use, shipping costs shown before you pay, and
					an{" "}
					<a href="/account" className="text-amber underline-offset-4 hover:underline">
						account
					</a>{" "}
					to follow your orders. Delivery and return terms are set out at checkout and in the store&apos;s
					policies.
					{contactFormEnabled ? (
						<>
							{" "}
							Anything else?{" "}
							<Link href="/contact" className="text-amber underline-offset-4 hover:underline">
								Write to us
							</Link>
							.
						</>
					) : null}
				</p>
			</Section>
		</PageShell>
	);
}
