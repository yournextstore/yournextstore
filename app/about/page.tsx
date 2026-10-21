import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
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
		<div className="relative overflow-hidden bg-white py-16 lg:py-24">
			<JsonLdScript data={aboutJsonLd} />
			<div className="relative px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-prose text-lg">
					<h1>
						<span className="block text-center text-base font-semibold tracking-wide text-brand uppercase">
							About
						</span>
						<span className="mt-2 block text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
							The {storeName} story
						</span>
					</h1>
					<p className="mt-8 text-center text-xl leading-8 text-gray-600">
						{storeDescription ?? "What we stock, and why we chose it."}
					</p>
				</div>
				<div className="prose prose-lg mx-auto mt-12 text-gray-600">
					<p>
						We believe the things you use every day should be the ones you enjoy most. Everything in the shop
						is chosen for the way it works, the way it looks and the way it fits into ordinary days.
					</p>
					<p>
						It started with a simple idea: fewer, better things. A small, considered range is easier to browse
						and easier to love than an endless one.
					</p>
					<p>Have a question about a product or an order? Get in touch any time.</p>
				</div>
				<div className="mx-auto mt-12 flex max-w-prose flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/products"
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-hover"
					>
						Shop all products
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
						>
							Contact us
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
