import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { BANNER_TITLE, Banner } from "@/components/sections/hero";
import { BANNER_IMAGES } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `Learn about ${storeName}: what we sell and how we choose it.`;

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

const POINTS = [
	{
		title: "Frames we would wear",
		body: "Every frame earns its place: good acetate or titanium, solid hinges and a fair price. If we would not wear it ourselves, it is not in the shop.",
	},
	{
		title: "Clear details",
		body: "Every frame lists its shape, material and measurements, so you can compare it with the pair you already own before you add it to your basket.",
	},
	{
		title: "Terms in writing",
		body: "Delivery options and costs are shown at checkout, and our shipping and return terms are on our policy pages.",
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, contactFormEnabled } = await getStoreInfo();
	const contactLink = contactFormEnabled ? (
		<Link href="/contact" className="sal-btn sal-btn-muted">
			Contact us
		</Link>
	) : null;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: `${storeName} sells well-made glasses, sunglasses and readers at honest prices.`,
	};

	return (
		<div className="min-h-svh px-4 pt-4 pb-12 md:px-8 lg:px-[100px] lg:pt-5 lg:pb-[100px]">
			<JsonLdScript data={aboutJsonLd} />
			<Banner image={BANNER_IMAGES.about}>
				<h1 className={BANNER_TITLE.replace("font-medium", "font-normal")}>
					<strong className="font-bold">About</strong> {storeName}
				</h1>
				<p className="mt-6 max-w-[27rem] text-sal-nav font-bold leading-6 text-paragraph">
					We started with one idea: buying glasses should be simple. Good frames, honest prices, clear
					measurements, and a checkout that shows every option before you pay.
				</p>
			</Banner>

			<section className="mt-14 md:mt-24 lg:mx-[50px]">
				<h2 className="mb-5 text-[1.625rem] font-medium leading-tight sm:text-sal-xl">What we do</h2>
				<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
					{POINTS.map((point, index) => (
						<div key={point.title} className="border border-border">
							<div className="flex h-[120px] items-center justify-center bg-tile">
								<span aria-hidden="true" className="text-[3rem] font-bold leading-none text-[#c9c9c9]">
									0{index + 1}
								</span>
							</div>
							<div className="p-5">
								<h3 className="text-[1.5rem] font-medium leading-tight">{point.title}</h3>
								<p className="mt-2 text-sal-nav font-bold leading-6 text-paragraph">{point.body}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="mt-14 flex flex-col items-start justify-between gap-5 border border-border bg-white p-8 md:mt-24 md:flex-row md:items-center lg:mx-[50px]">
				<div>
					<h2 className="text-sal-lg font-bold">Not sure where to start?</h2>
					<p className="mt-2 text-sal-nav font-bold text-paragraph">
						Browse the full shop, or read our answers to the questions we hear most.
					</p>
				</div>
				<div className="flex gap-2.5">
					<Link href="/products" className="sal-btn">
						Shop Now
					</Link>
					<Link href="/faq" className="sal-btn sal-btn-muted">
						Read the FAQ
					</Link>
					{contactLink}
				</div>
			</section>
		</div>
	);
}
