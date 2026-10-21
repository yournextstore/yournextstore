import { Phone, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { FeatureBanner } from "@/components/home/feature-banner";
import { Button } from "@/components/ui/button";
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

	return (
		<div className="mx-auto max-w-[1400px] p-6">
			<JsonLdScript data={aboutJsonLd} />

			<div className="mb-12 flex flex-col items-center justify-center gap-2 pt-8 text-center">
				<p className="text-sm font-medium uppercase tracking-wide">About us</p>
				<h1 className="text-4xl font-extrabold tracking-tight text-balance lg:text-5xl">{storeName}</h1>
				<p className="text-3xl font-semibold tracking-tight text-balance text-muted-foreground">
					{storeDescription ?? "Everyday essentials, from one place."}
				</p>
			</div>

			<div className="mx-auto max-w-3xl space-y-4 text-center leading-7">
				<p>
					We started {storeName} to make everyday shopping simple: a well-chosen range, honest prices and a
					checkout that shows every delivery option before you pay.
				</p>
				<p>
					Every product is picked by our team, and our shipping and return terms are written down on our
					policy pages, so you know where you stand before you order.
				</p>
			</div>

			<div className="mt-12 flex flex-col gap-4 md:grid md:grid-cols-3">
				<FeatureBanner
					heading="Clear delivery"
					text="Delivery options and costs are shown at checkout."
					icon={<Truck aria-hidden size={32} />}
				/>
				<FeatureBanner
					heading="Written policies"
					text="Shipping and return terms are on our policy pages."
					icon={<RotateCcw aria-hidden size={32} />}
				/>
				<FeatureBanner
					heading="Here to help"
					text="Questions about an order? Start with our FAQ."
					icon={<Phone aria-hidden size={32} />}
				/>
			</div>

			<div className="mt-12 flex w-full flex-col items-center justify-center gap-2 rounded-md bg-banner p-12 text-center text-banner-foreground">
				<p className="text-sm font-medium uppercase tracking-wide">Start shopping</p>
				<h2 className="text-3xl font-bold">See what is in the store</h2>
				<p>Browse the full catalogue, or ask us anything.</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Button variant="secondary" nativeButton={false} render={<Link href="/products" />}>
						Shop products
					</Button>
					<Button
						variant="secondary"
						nativeButton={false}
						render={<Link href={contactFormEnabled ? "/contact" : "/faq"} />}
					>
						{contactFormEnabled ? "Contact us" : "Help Centre"}
					</Button>
				</div>
			</div>
		</div>
	);
}
