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
		<div className="min-h-svh">
			<JsonLdScript data={aboutJsonLd} />

			{/* Header */}
			<section className="mx-3 py-16 text-center text-ink-soft md:mx-10 lg:px-32 lg:py-20 lg:text-left">
				<div className="grid gap-6 lg:grid-cols-2 xl:gap-12">
					<h1 className="font-bold text-5xl tracking-tight md:text-6xl lg:text-right xl:text-7xl">
						About us
					</h1>
					<div className="flex flex-col justify-center gap-4 text-[#4b5563] text-lg">
						{storeDescription && <p>{storeDescription}</p>}
						<p>
							We keep the shop small on purpose. Every product is chosen for how it looks, how it works and
							how long it lasts, and it stays only while we are happy to recommend it.
						</p>
					</div>
				</div>
			</section>

			<section className="bg-band px-3 py-16 md:px-10">
				<h2 className="pb-12 text-center font-extrabold text-4xl uppercase sm:text-5xl lg:text-6xl">
					What we care about
				</h2>
				<div className="mx-auto grid max-w-6xl gap-10 text-center md:grid-cols-3">
					<div>
						<h3 className="font-bold text-xl uppercase">Good design</h3>
						<p className="mt-3 text-muted-foreground">
							Clean lines and honest materials that suit every day.
						</p>
					</div>
					<div>
						<h3 className="font-bold text-xl uppercase">Quality</h3>
						<p className="mt-3 text-muted-foreground">Things we would happily use ourselves.</p>
					</div>
					<div>
						<h3 className="font-bold text-xl uppercase">Simple shopping</h3>
						<p className="mt-3 text-muted-foreground">
							Clear prices, a short checkout and nothing in the way.
						</p>
					</div>
				</div>
			</section>

			<section className="px-3 py-20 text-center">
				<p className="font-extrabold text-3xl uppercase md:text-5xl">Ready to look around?</p>
				<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Link href="/products" className="btn-sun h-12 w-full max-w-xs px-8 uppercase">
						Shop all products
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex h-12 w-full max-w-xs items-center justify-center border-2 border-foreground px-8 font-bold uppercase hover:bg-foreground hover:text-background"
						>
							Contact us
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
