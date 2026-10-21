import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Em } from "@/components/brand/em";
import { ArrowRightIcon } from "@/components/icons";
import { Closing } from "@/components/sections/closing";
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
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About",
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
			storeDescription ?? "Learn about our scents, the materials behind them and how they are composed.",
	};

	return (
		<>
			<div className="container-page pb-24 pt-14 md:pb-32 md:pt-18">
				<JsonLdScript data={aboutJsonLd} />
				<h1 className="max-w-4xl font-display text-title-xl text-balance md:text-[3.75rem] md:leading-[1.05]">
					Composed slowly, <Em>worn closely</Em>
				</h1>
				<div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
					<div className="max-w-xl">
						{storeDescription && <p className="text-lead text-ink/85">{storeDescription}</p>}
						<div className="mt-10 space-y-6 text-ink/75">
							<p>
								{storeName} works with a short list of materials: cedar, iris, amber, fig, smoke. Each scent
								is built around one of them and written out in full, top to heart to base.
							</p>
							<p>
								The same accords carry over into candles and body care, so a scent you like on skin can fill a
								room or follow you out of the bath.
							</p>
							<p>
								If you are new to the house, start small: try a few scents over several days and notice how
								each one changes as it settles.
							</p>
						</div>
						<div className="mt-10 flex flex-wrap gap-3">
							<Link href="/products" className="btn-glass">
								Browse the shelf
								<ArrowRightIcon width={18} height={18} />
							</Link>
							{contactFormEnabled && (
								<Link href="/contact" className="btn-line h-12 rounded-full px-8">
									Write to us
								</Link>
							)}
						</div>
					</div>
					<ul aria-label="Materials" className="grid grid-cols-2 gap-4">
						{MATERIALS.map((item) => (
							<li
								key={item.src}
								className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-surface"
							>
								<Image
									src={item.src}
									alt={item.alt}
									fill
									sizes="(min-width: 1024px) 22vw, 50vw"
									className="object-cover"
								/>
								<span className="absolute bottom-3 left-3 rounded-full bg-page/70 px-3.5 py-1.5 text-sm text-ink backdrop-blur-[10px]">
									{item.label}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			<Closing />
		</>
	);
}

const MATERIALS = [
	{ src: "/images/materials/cedar.jpg", label: "Cedar", alt: "Cedar shavings and split cedar wood" },
	{ src: "/images/materials/iris.jpg", label: "Iris", alt: "A purple iris flower beside dried orris roots" },
	{ src: "/images/materials/amber.jpg", label: "Amber", alt: "Glowing pieces of golden amber resin" },
	{
		src: "/images/materials/smoke.jpg",
		label: "Smoke",
		alt: "Birch bark and a smouldering wood chip with smoke",
	},
] as const;
