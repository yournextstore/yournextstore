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

	return (
		<div className="w-full">
			<JsonLdScript data={aboutJsonLd} />
			<div className="mx-8 max-w-2xl py-20 sm:mx-auto">
				<h1 className="mb-8 text-5xl font-bold">About</h1>
				<div className="page-prose">
					<p>
						{storeDescription ? `${storeDescription} ` : ""}
						{storeName} is a small shop with a simple idea: a short list of things we would use ourselves,
						shown plainly, priced fairly and shipped with care.
					</p>
					<p>What you can expect from us:</p>
					<ul>
						<li>Clear photos and honest descriptions for every product</li>
						<li>Prices that include what they say they include</li>
						<li>Secure checkout with the payment methods you already use</li>
						<li>
							An <a href="/account">account</a> to follow your orders and reorder in a click
						</li>
						<li>Real people answering your questions before and after you buy</li>
						<li>And more as the catalogue grows!</li>
					</ul>
					<p>Where to start:</p>
					<ul>
						<li>
							Browse <Link href="/products">all products</Link>, sorted the way you like
						</li>
						<li>
							Read the <Link href="/faq">frequently asked questions</Link>
						</li>
						{contactFormEnabled ? (
							<li>
								<Link href="/contact">Write to us</Link> with anything else
							</li>
						) : null}
					</ul>
				</div>
			</div>
		</div>
	);
}
