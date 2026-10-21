import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { PageBanner } from "@/components/brew/page-banner";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_BANNER, ABOUT_INLINE } from "@/lib/editorial";
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

	const principles = [
		{
			code: "01",
			title: "Measured, not guessed",
			body: "Price, options and stock are written down for every piece, so what you read on the page is what reaches the basket.",
		},
		{
			code: "02",
			title: "Honest readouts",
			body: "Every item carries the numbers that matter: what it is, what it costs, how many are left. No adjectives standing in for data.",
		},
		{
			code: "03",
			title: "One plain checkout",
			body: "One basket, one total and one secure checkout page. Delivery and taxes are worked out there, before you pay.",
		},
	];

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<PageBanner
				image={ABOUT_BANNER.src}
				eyebrow="About the shop"
				title={
					<>
						Held to <em>a standard.</em>
					</>
				}
				lead={
					storeDescription ??
					`${storeName} keeps a short line of everyday things and prints the numbers on every one, so each order lands the way you expected.`
				}
			/>

			<section className="section-x section-y">
				<div className="frame grid items-center gap-[clamp(24px,4vw,56px)] md:grid-cols-2">
					<div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-panel">
						<Image
							src={ABOUT_INLINE.src}
							alt={ABOUT_INLINE.alt}
							fill
							sizes="(max-width: 768px) 100vw, 600px"
							className="object-cover"
						/>
					</div>
					<div>
						<p className="eyebrow mb-[1.4rem]">Our story</p>
						<h2 className="title-section mb-6 text-ink">
							Weigh it <em>first.</em>
						</h2>
						<div className="space-y-4 text-[1.02rem] text-dim">
							<p>
								{storeName} started with a simple rule: if it can be measured, measure it. Every piece gets
								its price, its options and its stock printed plainly on its own page.
							</p>
							<p>
								We keep the readouts plain and the line short, so it is easy to find the one you will come
								back to.
							</p>
						</div>
					</div>
				</div>
			</section>

			<div aria-hidden="true" className="section-x">
				<div className="ruler" />
			</div>

			<section className="section-x section-y">
				<div className="frame mb-[clamp(36px,5vh,60px)]">
					<p className="eyebrow mb-[1.4rem]">House rules</p>
					<h2 className="title-section text-ink">
						Three rules, <em>no exceptions.</em>
					</h2>
				</div>
				<div className="frame grid overflow-hidden rounded-[4px] border border-line md:grid-cols-3">
					{principles.map((p) => (
						<article
							key={p.code}
							className="border-line p-[clamp(22px,2.6vw,32px)] not-first:border-t md:not-first:border-t-0 md:not-first:border-l"
						>
							<p className="font-readout text-[1.5rem] leading-none font-medium text-copper">{p.code}</p>
							<h3 className="mt-2.5 mb-2.5 text-[1.7rem] text-ink">{p.title}</h3>
							<p className="max-w-[34ch] text-[0.9rem] leading-normal text-dim">{p.body}</p>
						</article>
					))}
				</div>
				<div className="frame mt-7 flex flex-wrap gap-3.5">
					<Link href="/products" className="btn btn-primary">
						Shop the counter
					</Link>
					{contactFormEnabled ? (
						<Link href="/contact" className="btn btn-ghost">
							Talk to the counter
						</Link>
					) : (
						<Link href="/faq" className="btn btn-ghost">
							Read the FAQ
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
