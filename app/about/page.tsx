import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getShopCategories } from "@/lib/catalog";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName} — our story, our values, and the people behind the products.`;

	return {
		title: "Our story",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "Our story",
			description,
			url: "/about",
		},
	};
}

async function getStoreInfo() {
	try {
		const [me, products, categories] = await Promise.all([
			meGetCached(),
			commerce.productBrowse({ active: true, limit: 1 }),
			getShopCategories(),
		]);
		return {
			storeName: me.store.name || "our store",
			storeDescription: me.store.settings?.storeDescription || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
			productCount: products.meta.count,
			categoryCount: categories.length,
		};
	} catch {
		return {
			storeName: "our store",
			storeDescription: null,
			contactFormEnabled: false,
			productCount: 0,
			categoryCount: 0,
		};
	}
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled, productCount, categoryCount } =
		await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? "Our story, how we choose what we sell, and how shopping with us works.",
	};

	const facts = [
		productCount > 0 ? `${productCount} pieces in the collection` : "A small, considered collection",
		categoryCount > 1 ? `${categoryCount} ways to browse` : "No account needed",
		"A secure hosted checkout",
	];

	return (
		<div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 md:py-20">
			<JsonLdScript data={aboutJsonLd} />
			<p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
				About {storeName}
			</p>
			<h1 className="mt-5 max-w-xl font-display text-5xl leading-[1.1] tracking-tight md:text-6xl">
				Small details. <span className="italic">A considered everyday.</span>
			</h1>
			<p className="mt-7 text-base leading-8 text-muted-foreground">
				{storeDescription ??
					`${storeName} is a small collection of pieces chosen slowly and made to be worn often. Fewer things, better made, with room for the ones you love.`}
			</p>
			<ul className="my-12 grid gap-3 sm:grid-cols-3">
				{facts.map((text) => (
					<li
						key={text}
						className="rounded-lg border bg-muted/50 p-5 text-center text-xs font-medium text-primary"
					>
						{text}
					</li>
				))}
			</ul>

			<h2 className="mt-10 font-display text-3xl">How to shop with us</h2>
			<ol className="mt-5 list-inside list-decimal space-y-3 text-sm leading-7 text-muted-foreground marker:text-primary">
				<li>Browse the collection, or search for a piece by name.</li>
				<li>Choose your option and add it to your cart.</li>
				<li>Check out securely; you can sign in with your email on the way.</li>
				<li>Follow your order from your account until it arrives.</li>
			</ol>

			<h2 className="mt-12 border-t pt-10 font-display text-3xl">What we care about</h2>
			<p className="mt-5 text-sm leading-7 text-muted-foreground">
				Materials that feel good and last. Designs that work with what you already own. Clear prices, careful
				packing and real people on the other end when you have a question.
			</p>
			<p className="mt-4 text-sm leading-7 text-muted-foreground">
				Your cart is saved, so you can come back to it when you are ready. Payments go through a secure hosted
				checkout, so your card details never pass through this site.
			</p>

			<div className="mt-10 flex flex-wrap gap-4">
				<Link
					className="rounded-md bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
					href="/products"
				>
					Explore the collection
				</Link>
				<Link
					className="rounded-md border px-6 py-3.5 text-sm transition-colors hover:bg-muted"
					href={contactFormEnabled ? "/contact" : "/faq"}
				>
					{contactFormEnabled ? "Get in touch ↗" : "Read the FAQ ↗"}
				</Link>
			</div>
		</div>
	);
}
