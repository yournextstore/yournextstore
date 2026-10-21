import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Closer, EstateSection, HERO_IMAGES, LandscapeHero, SectionHead } from "@/components/sections/home";
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
		title: "One at a time",
		copy: "Every wine has its own entry: grape, vintage, site and lot, the sizes it comes in and what it costs, written out in full.",
	},
	{
		title: "A short list",
		copy: "A short cellar list on purpose, kept in shelves and collections you can read end to end in one sitting.",
	},
	{
		title: "The account, open",
		copy: "Prices, stock and options stand on every entry as they are today. Delivery and taxes are settled at checkout.",
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
			<LandscapeHero
				compact
				image={HERO_IMAGES.about}
				eyebrow="The house — how the books are kept"
				title={
					<h1 className="serif text-[clamp(3rem,9vw,6.6rem)] font-medium leading-[0.98] text-cream [text-shadow:0_2px_40px_rgba(20,3,10,.5)]">
						<span className="hero-line">
							<span>The house</span>
						</span>
						<span className="hero-line">
							<span>
								<em className="font-normal text-gold-2 italic">and its ledger</em>
							</span>
						</span>
					</h1>
				}
				sub={brand.tagline}
			/>

			<EstateSection kicker="Nº 01 — The house" />

			<section aria-labelledby="principles-title" className="ledger-rule section-y">
				<div className="container-x">
					<SectionHead
						id="principles-title"
						kicker="Nº 02 — How we keep it"
						title={
							<>
								Three rules, <em>kept plainly.</em>
							</>
						}
						lede={`${storeName} keeps a short list and keeps it well. These are the three rules every entry answers to.`}
					/>
					<ol className="grid gap-5 lg:grid-cols-3">
						{PRINCIPLES.map((principle, index) => (
							<li
								key={principle.title}
								className="reveal rounded-[4px] border border-line bg-panel p-[clamp(22px,3.4vw,34px)]"
							>
								<p className="ledger mb-[0.7rem] text-[0.62rem] tracking-[0.2em] text-faint">
									Rule Nº {String(index + 1).padStart(2, "0")}
								</p>
								<h3 className="serif text-[1.9rem] font-medium leading-[1.1] text-gold-2">
									{principle.title}
								</h3>
								<p className="mt-3 text-[0.98rem] leading-[1.7] text-dim">{principle.copy}</p>
							</li>
						))}
					</ol>
					<div className="reveal mt-12 flex flex-wrap items-center gap-4">
						<Link href="/products" className="btn btn-primary">
							Read the ledger
						</Link>
						<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn">
							{contactFormEnabled ? "Write to us" : "Read the questions"} <span aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			</section>

			<Closer
				line={
					<>
						Good things keep their own <em>accounts.</em>
					</>
				}
				href="/#shelves"
				cta="See the shelves"
			/>
		</>
	);
}
