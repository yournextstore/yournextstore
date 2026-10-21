import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { BeforeYouGo, FindYourWay, PageMasthead, Tagline } from "@/components/sections/home";
import { getStoreBrand } from "@/lib/catalog";
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

const PRINCIPLES = [
	{
		title: "Chosen slowly",
		copy: "Every bottle on the shelf is tasted before it earns a place, and every bar tool is one we use behind our own counter.",
	},
	{
		title: "A short list",
		copy: "A short shelf on purpose: the bottles we would pour for ourselves, added as they arrive.",
	},
	{
		title: "Plain prices",
		copy: "Prices and stock stand on every bottle as they are today, and delivery is set out at checkout before you pay.",
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [{ storeName, storeDescription, contactFormEnabled }, brand] = await Promise.all([
		getStoreInfo(),
		getStoreBrand(),
	]);

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
			<PageMasthead kicker="About" title={storeName} line={brand.tagline} />
			<Tagline />

			<section aria-labelledby="house-title" className="section-y">
				<div className="container-narrow text-center">
					<h2 id="house-title" className="section-title">
						The House
					</h2>
					<p className="mx-auto max-w-[60ch] text-[1.0625rem] leading-[1.75] text-ink">
						{storeDescription ??
							`${storeName} keeps a short shelf of everyday things, chosen slowly, by taste, and with everyday use in mind.`}
					</p>
				</div>
			</section>

			<section aria-labelledby="principles-title" className="section-y bg-panel">
				<div className="container-x">
					<h2 id="principles-title" className="section-title">
						How We Choose
					</h2>
					<ol className="grid gap-6 md:grid-cols-3">
						{PRINCIPLES.map((principle, index) => (
							<li key={principle.title} className="rounded-[4px] border border-gold/15 bg-page p-6">
								<p className="caps mb-2 text-[0.75rem] tracking-[0.15em] text-dim">
									No. {String(index + 1).padStart(2, "0")}
								</p>
								<h3 className="serif mb-3 text-[1.25rem] font-bold tracking-[0.05em] text-gold">
									{principle.title}
								</h3>
								<p className="text-[0.9375rem] leading-[1.75] text-ink">{principle.copy}</p>
							</li>
						))}
					</ol>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<Link href="/products" className="btn btn-primary">
							Browse the shelf
						</Link>
						<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn">
							{contactFormEnabled ? "Write to us" : "Read the FAQ"} <span aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			</section>

			<FindYourWay />
			<BeforeYouGo />
		</>
	);
}
