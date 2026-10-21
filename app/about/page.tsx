import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Crumbs } from "@/components/crumbs";
import { getStoreIdentity } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { EDITORIAL } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
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

const VALUES = [
	{ title: "Recycled metals", text: "Gold vermeil and sterling silver, made from recycled metal." },
	{ title: "Made to layer", text: "Simple shapes that work alone or together." },
	{ title: "Honest pricing", text: "Clear prices, shown up front." },
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreIdentity();

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
			<section className="bg-canvas">
				<div className="page-width">
					<Crumbs items={[{ label: "About us" }]} />
				</div>
				<div className="page-width grid items-center gap-8 pb-[clamp(40px,5vw,64px)] pt-2 min-[901px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] min-[901px]:gap-12">
					<div className="grid max-w-[34rem] gap-3.5">
						<span className="ed-eyebrow">Our story</span>
						<h1 className="ed-display m-0 text-display-hero">
							About
							<em className="block italic">{storeName}</em>
						</h1>
						<p className="m-0 text-base leading-[1.55] text-muted-foreground">
							{storeDescription ??
								"We are a small jewellery studio making fine everyday pieces in gold vermeil and sterling silver."}
						</p>
						<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
							<Link href="/products" className="ed-btn">
								Shop the collection
							</Link>
							{contactFormEnabled && (
								<Link href="/contact" className="ed-link">
									Contact us
									<ArrowRight aria-hidden />
								</Link>
							)}
						</div>
					</div>
					<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone">
						<YNSMedia
							src={EDITORIAL.about}
							alt=""
							fill
							sizes="(min-width: 901px) 56vw, 100vw"
							priority
							className="object-cover"
						/>
					</div>
				</div>
			</section>

			<section className="bg-card">
				<div className="page-width ed-band grid gap-10 min-[901px]:grid-cols-2 min-[901px]:gap-16">
					<div>
						<span className="ed-eyebrow mb-2.5">How we work</span>
						<h2 className="ed-display m-0 text-display-section">Chosen to be kept</h2>
					</div>
					<div className="space-y-4 text-base leading-[1.65] text-muted-foreground">
						<p className="m-0">
							Each product is chosen for the way it works as much as for the way it looks, so the range stays
							small, considered and easy to live with.
						</p>
						<p className="m-0">Browse the full catalogue, or start with a category that suits the moment.</p>
					</div>
				</div>
			</section>

			<section className="bg-canvas pb-[clamp(40px,5vw,64px)]" aria-labelledby="values">
				<div className="page-width pt-[clamp(40px,5vw,64px)]">
					<h2 id="values" className="ed-display m-0 mb-6 text-display-section">
						What we stand for
					</h2>
					<ul className="m-0 grid list-none border-y border-border p-0 min-[901px]:grid-cols-3">
						{VALUES.map((value, index) => (
							<li
								key={value.title}
								className={
									index > 0
										? "border-t border-border px-0 py-6 min-[901px]:border-t-0 min-[901px]:border-l min-[901px]:px-7"
										: "py-6 min-[901px]:pr-7"
								}
							>
								<p className="m-0 text-sm font-semibold">{value.title}</p>
								<p className="m-0 mt-1 text-sm text-muted-foreground">{value.text}</p>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
}
