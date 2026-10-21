import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { FieldBanner } from "@/components/field/field-banner";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { GRID_REFS } from "@/lib/field";
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
			title: "Used before it's sold",
			body: "Everything in the range is chosen to be pitched, slept in and cooked on far from the road, not to look good on a shelf.",
		},
		{
			code: "02",
			title: "Honest spec sheets",
			body: "Every item carries the details that matter — weight, materials, ratings and what it costs. No adjectives standing in for facts.",
		},
		{
			code: "03",
			title: "Questions welcome",
			body: "Not sure what fits your trip? Ask before you order, or check the FAQ and store policies any time.",
		},
	];

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<FieldBanner
				image="/images/pexels/about-lake.jpg"
				gridRef={GRID_REFS[4]}
				eyebrow="ABOUT US"
				title={
					<>
						Made for nights
						<br />
						past the last road.
					</>
				}
				lead={
					storeDescription ??
					`${storeName} is for people who take the long way round: tents, sleeping bags and packs with plain specs, rated for the weather they will meet.`
				}
			/>

			<section className="cut-both section-x section-y">
				<div className="frame grid items-center gap-[clamp(20px,4vw,44px)] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
					<div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-line bg-panel">
						<Image
							src="/images/pexels/about-city-bokeh.jpg"
							alt="Expedition packs, coiled orange ropes and an ice axe against a mountain hut wall, lit by a lantern at night."
							fill
							sizes="(max-width: 768px) 100vw, 640px"
							className="object-cover"
						/>
						<span aria-hidden="true" className="hatch absolute bottom-0 left-0 h-[7px] w-[88px] opacity-40" />
					</div>
					<div>
						<p className="eyebrow mb-[1.4rem]">
							<span className="grid-ref" aria-hidden="true">
								[ {GRID_REFS[2]} ]
							</span>
							OUR STORY
						</p>
						<h2 className="title-section mb-6 text-ink">Pack what earns its weight.</h2>
						<div className="space-y-4 text-[1.02rem] text-dim">
							<p>
								{storeName} started with a simple rule: pack only what earns its weight. Every tent, bag and
								stove in the range is chosen for the night it will meet, not the shelf it sits on.
							</p>
							<p>
								We keep the range small, the spec sheets plain and the photos honest, so what arrives is what
								you expected.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="section-x section-y">
				<div className="frame mb-12">
					<p className="eyebrow mb-[1.4rem]">
						<span className="grid-ref" aria-hidden="true">
							[ {GRID_REFS[3]} ]
						</span>
						HOW WE WORK
					</p>
					<h2 className="title-section text-ink">
						Three rules,
						<br />
						no exceptions.
					</h2>
				</div>
				<div className="frame grid overflow-hidden rounded-[2px] border border-line md:grid-cols-3">
					{principles.map((p) => (
						<article
							key={p.code}
							className="border-line p-[clamp(22px,3vw,32px)] not-first:border-t md:not-first:border-t-0 md:not-first:border-l"
						>
							<p className="font-display mb-4 text-[2.6rem] leading-none text-signal">{p.code}</p>
							<h3 className="mb-3 text-[1.6rem] text-ink">{p.title}</h3>
							<p className="text-[0.96rem] text-dim">{p.body}</p>
						</article>
					))}
				</div>
				<div className="frame mt-[2.6rem] flex flex-wrap gap-3.5">
					<Link href="/products" className="btn btn-primary">
						Shop the range
					</Link>
					{contactFormEnabled ? (
						<Link href="/contact" className="btn btn-ghost">
							Get in touch
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
