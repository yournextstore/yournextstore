import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Notebook } from "@/components/notebook";
import { SectionHead, StorySection } from "@/components/sections/home";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_PHOTO } from "@/lib/editorial";
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

const VALUES = [
	{
		title: "Chosen slowly",
		copy: "A small range of paper, pens and ink, picked one at a time for writing in rather than for show.",
	},
	{
		title: "Described plainly",
		copy: "What it is, what it costs, how many are left. Every item gets its own page, with the paper weight and size spelled out.",
	},
	{
		title: "Paid for plainly",
		copy: "One basket, one honest total and one secure checkout page, whenever you are ready.",
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();
	const image = ABOUT_PHOTO;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<section className="wrap grid items-center gap-[clamp(1.6rem,4vw,3.6rem)] pb-[clamp(2rem,5vw,3rem)] pt-[clamp(2.5rem,6vw,4.5rem)] min-[920px]:grid-cols-[1.02fr_0.98fr]">
				<SectionHead
					as="h1"
					reveal={false}
					kicker="About"
					title={
						<>
							A small shop, kept like <em>a notebook.</em>
						</>
					}
					lede={
						storeDescription && storeDescription.length > 40
							? storeDescription
							: `${storeName} is a short list of good paper goods, written down carefully and kept up to date — the kind of list you’d keep in a notebook by the door.`
					}
				/>
				<Notebook
					priority
					image={image}
					pages={[2, 3]}
					note={
						<>
							the first page —
							<br />
							where the list began
						</>
					}
					captionStart={<>No. 00 — “{storeName}”</>}
					captionEnd="kept since day one"
				/>
			</section>

			<section aria-labelledby="values-title" className="wrap py-[clamp(3rem,7vw,5rem)]">
				<SectionHead
					id="values-title"
					kicker="House rules"
					className="mb-10"
					title={
						<>
							Three rules, <em>written in ink.</em>
						</>
					}
				/>
				<ol className="grid gap-[1.1rem] md:grid-cols-3">
					{VALUES.map((value, index) => (
						<li
							key={value.title}
							className="reveal rounded-2xl border border-line bg-panel p-6"
							style={{ "--d": `${index * 0.1}s` } as React.CSSProperties}
						>
							<span aria-hidden="true" className="mono text-[0.72rem] text-blue-ink">
								No. {String(index + 1).padStart(2, "0")}
							</span>
							<h3 className="mt-3 text-[1.45rem]">{value.title}</h3>
							<p className="mt-2 text-[0.92rem] text-dim">{value.copy}</p>
						</li>
					))}
				</ol>
				<div className="mt-10 flex flex-wrap items-center gap-3">
					<Link href="/products" className="btn btn-primary">
						Feel the range
					</Link>
					<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn btn-ghost">
						{contactFormEnabled ? "Write to us" : "Read the questions"} <span aria-hidden="true">→</span>
					</Link>
				</div>
			</section>

			<StorySection />
		</div>
	);
}
