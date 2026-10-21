import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getHomeData } from "@/lib/catalog";
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
			storeName: me.store.name || "our store",
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

	const { productCount, collections, priceFrom, shipping } = await getHomeData();
	const chips = [
		`${productCount} parts`,
		`${collections.length} collections`,
		...(priceFrom ? [`from ${priceFrom}`] : []),
		...(shipping ? [shipping.toLowerCase()] : []),
		"secure hosted checkout",
	];
	const steps = [
		{
			name: "01 — Pick",
			spec: "one decision, not twenty",
			note: "The catalogue is short on purpose. Every part is there because it does its job well.",
		},
		{
			name: "02 — Read the spec sheet",
			spec: "price · options · availability",
			note: "Each product page states what you get in plain words. No asterisks, no surprise add-ons.",
		},
		{
			name: "03 — Check out",
			spec: "taxes and shipping up front",
			note: "Pay at a secure checkout, with delivery options and costs shown before you commit.",
		},
	];

	return (
		<div className="mx-auto w-[min(100%-2.4rem,820px)] pb-20 pt-10 sm:pt-14">
			<JsonLdScript data={aboutJsonLd} />

			<Link href="/" className="text-[0.92rem] text-muted-foreground transition-colors hover:text-foreground">
				← Back to {storeName}
			</Link>
			<p className="hs-kicker mb-3 mt-8">[ About ]</p>
			<h1 className="hs-display hs-h1">How {storeName} is put together</h1>
			<p className="hs-lede mt-5 text-[1.1rem]">
				{storeDescription ??
					"A small e-bike shop with a simple rule: state every part plainly. Bikes, batteries and kit for the ride across town, priced on the tag."}
			</p>
			<ul className="mt-7 flex flex-wrap gap-2">
				{chips.map((chip) => (
					<li key={chip} className="hs-chip">
						{chip}
					</li>
				))}
			</ul>

			<figure className="hs-card mt-12 p-4 sm:p-6">
				<div className="relative aspect-[4/3] overflow-hidden rounded-lg">
					<Image
						src="/images/hero-ebike.jpg"
						alt="A graphite urban e-bike with an integrated battery, mudguards and a rear rack, side on"
						fill
						sizes="(min-width: 768px) 720px, 100vw"
						className="object-cover"
					/>
				</div>
				<figcaption className="hs-label mt-3 flex flex-wrap justify-between gap-2">
					<span>[ The commuter ]</span>
					<span>Every part stated plainly</span>
				</figcaption>
			</figure>

			<section className="mt-14">
				<h2 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-black tracking-[-0.02em]">
					The idea
				</h2>
				<div className="mt-4 space-y-4 text-[1.05rem] text-muted-foreground">
					<p>
						Most shops show you a glamour shot and a spec table, far apart, hoping you won't compare them.
						We'd rather print the facts on the thing itself: what it is, what it costs, what comes with it and
						what doesn't.
					</p>
					<p>
						So the catalogue is short, the product pages are plain, and the price you see is the price you pay
						before shipping and tax — both shown before you commit.
					</p>
				</div>
			</section>

			<section className="mt-14">
				<h2 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-black tracking-[-0.02em]">
					How to shop
				</h2>
				<div className="mt-6 grid gap-4 sm:grid-cols-3">
					{steps.map((step) => (
						<article key={step.name} className="hs-card px-5 py-4">
							<h3 className="hs-kicker text-[0.72rem] tracking-[0.14em]">{step.name}</h3>
							<p className="hs-mono mt-2 text-[0.74rem]">{step.spec}</p>
							<p className="mt-2 text-[0.9rem] text-muted-foreground">{step.note}</p>
						</article>
					))}
				</div>
			</section>

			<div className="hs-panel mt-14 p-6 sm:p-8">
				<h2 className="hs-display text-[1.5rem]">Seen enough?</h2>
				<p className="mt-2 text-muted-foreground">The whole catalogue fits on one page.</p>
				<div className="mt-5 flex flex-wrap gap-3">
					<Link href="/products" className="hs-btn hs-btn-primary">
						Shop the catalogue
					</Link>
					{contactFormEnabled ? (
						<Link href="/contact" className="hs-btn hs-btn-ghost">
							Contact us
						</Link>
					) : (
						<Link href="/faq" className="hs-btn hs-btn-ghost">
							Read the FAQ
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
