import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { CollectionBanner, SectionHeading } from "@/components/collection-banner";
import { buttonDark, FeatureCards, LessIsMore } from "@/components/sections/home";
import { EDITORIAL } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

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

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<div className="shell grid gap-8 pt-6 pb-8 md:py-8">
				<CollectionBanner title="Our Story" image={EDITORIAL.aboutBanner} />
				<SectionHeading
					heading={`About ${storeName}`}
					description={
						storeDescription ??
						"We believe in the power of thoughtful design. Every piece in the shop is chosen to bring quality, beauty and function into the everyday, with simple forms and honest materials that outlast passing trends."
					}
				/>
				<FeatureCards />
				<div className="flex flex-wrap justify-center gap-4 pt-8">
					<Link href="/products" className={cn(buttonDark, "h-11 px-8")}>
						Shop now
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex h-11 items-center justify-center rounded-sm border border-input px-8 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
						>
							Contact us
						</Link>
					)}
				</div>
			</div>
			<LessIsMore image={EDITORIAL.aboutLess} />
		</>
	);
}
