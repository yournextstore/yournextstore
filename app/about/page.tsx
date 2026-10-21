import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Faceplate } from "@/components/rack/faceplate";
import { PageHead } from "@/components/rack/page-head";
import { Kicker } from "@/components/rack/section-head";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_PHOTO } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import { plateName } from "@/lib/rack";
import { YNSMedia } from "@/lib/yns-media";

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

	const photo = ABOUT_PHOTO;

	const principles = [
		{
			code: "01",
			title: "Built to be patched",
			body: "Modules that work together: mix them, swap them, build a system of your own. Each one is useful on its first patch.",
		},
		{
			code: "02",
			title: "Honest spec lines",
			body: "Every module prints the numbers that matter — HP, power draw, what it costs and whether it is on the shelf. No adjectives standing in for data.",
		},
		{
			code: "03",
			title: "One plain checkout",
			body: "One basket, one total and one secure checkout page. Delivery and taxes are worked out there, before you pay.",
		},
	];

	return (
		<div className="pb-[clamp(4rem,9vw,7rem)]">
			<JsonLdScript data={aboutJsonLd} />
			<PageHead
				kicker={`About ${storeName}`}
				title="Signal in. Sound out. That's the whole idea."
				lead={
					storeDescription ??
					`${storeName} is a small eurorack shop: oscillators, filters, modulation and effects, plus the cases and cables to hold them together.`
				}
				watermark="PATCH"
			/>

			<section className="section-x pt-[clamp(3rem,7vw,5rem)]">
				<div className="frame grid items-center gap-[clamp(1.6rem,4vw,3.6rem)] md:grid-cols-[.9fr_1.1fr]">
					<div className="mx-auto w-full max-w-[22rem]">
						<Faceplate legend={plateName(storeName)} size="page" led="green">
							{photo ? <YNSMedia src={photo} alt="" fill sizes="22rem" className="object-cover" /> : null}
						</Faceplate>
					</div>
					<div className="max-w-[56ch]">
						<Kicker className="mb-4">The bench</Kicker>
						<h2 className="title-section text-ink">Every set you patch is one of one.</h2>
						<p className="lead mt-4">
							Every module in the line is printed with exactly what it is: what it does, what it costs and
							whether it is on the shelf today. Patch them together the way you like.
						</p>
						<p className="mt-4 text-dim">
							Mix them, move them, put a bright one next to a quiet one. The best combination is rarely the
							one the manual suggested.
						</p>
						<div className="mt-[1.8rem] flex flex-wrap gap-[0.7rem]">
							<Link href="/products" className="btn btn-primary">
								See the line
							</Link>
							{contactFormEnabled ? (
								<Link href="/contact" className="btn btn-ghost">
									Write to a person <span aria-hidden="true">→</span>
								</Link>
							) : (
								<Link href="/faq" className="btn btn-ghost">
									Read the FAQ <span aria-hidden="true">→</span>
								</Link>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className="section-x pt-[clamp(4rem,9vw,6.5rem)]">
				<div className="frame">
					<Kicker className="mb-4">How we work</Kicker>
					<h2 className="title-section mb-[2.6rem] max-w-[22ch] text-ink">Three rules on the bench.</h2>
					<div className="grid gap-[1.1rem] md:grid-cols-3">
						{principles.map((p) => (
							<article key={p.code} className="panel-card lift px-[1.4rem] pt-[1.4rem] pb-[1.5rem]">
								<p className="font-plate mb-3 flex items-center gap-2 text-[0.72rem] tracking-[0.14em] text-signal">
									<i aria-hidden="true" className="led led--amber" />
									{p.code}
								</p>
								<h3 className="text-[1.35rem] text-ink">{p.title}</h3>
								<p className="mt-3 text-[0.92rem] text-dim">{p.body}</p>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
