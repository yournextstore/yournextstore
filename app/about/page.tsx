import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ListingBand } from "@/components/listing-band";
import { ArrowUpRight, HeroStar } from "@/components/shapes";
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
			storeName: me.store.settings?.storeName || me.store.name || "our store",
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

	const values = [
		{
			title: "Loud by design",
			text: "Colour, shape and attitude first. Pieces that start conversations, not blend in.",
			tone: "bg-lilac",
		},
		{
			title: "Made to be worn",
			text: "Fabrics and cuts that take a beating, wash after wash and season after season.",
			tone: "bg-tangerine",
		},
		{
			title: "Real people",
			text: "A small team that answers your messages, packs your order and fixes what goes wrong.",
			tone: "bg-mint",
		},
	];

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<ListingBand
				title="About us"
				crumbs={[{ href: "/", label: "Home" }, { label: "About us" }]}
				description={storeDescription}
			/>

			<section className="py-[75px] md:py-[150px]">
				<div className="sp-container grid gap-[50px] sp-xl:grid-cols-2 sp-xl:items-center">
					<div>
						<h2 className="font-title mb-[30px] text-sp-3 md:text-sp-3-md">Our story</h2>
						<div className="space-y-5 text-sp-8 leading-[1.8]">
							<p>
								{storeName} started with a simple idea: getting dressed should be fun. We hunt down bold
								basics and statement pieces, test them ourselves and only keep what we would wear.
							</p>
							<p>
								Every drop is small and picked by hand, so the shop keeps changing. If something catches your
								eye, do not wait too long. It might not come back.
							</p>
						</div>
					</div>
					<div className="relative mx-auto hidden w-full max-w-[520px] sp-xl:block" aria-hidden="true">
						<HeroStar className="absolute -top-16 -left-16" />
						<div className="relative aspect-square border-2 border-ink bg-lilac shadow-brut">
							<p className="font-title absolute inset-0 grid place-items-center p-10 text-center text-sp-3-md">
								Wear it loud
							</p>
						</div>
					</div>
				</div>
			</section>

			<section aria-labelledby="values-title" className="pb-[75px] md:pb-[150px]">
				<div className="sp-container">
					<h2 id="values-title" className="font-title mb-[45px] text-center text-sp-3 md:text-sp-3-md">
						What we stand for
					</h2>
					<ul className="grid gap-6 md:grid-cols-3">
						{values.map((value) => (
							<li key={value.title} className="border-2 border-ink bg-background shadow-brut">
								<div className={`h-4 border-b-2 border-ink ${value.tone}`} />
								<div className="p-[30px]">
									<h3 className="font-title text-sp-6">{value.title}</h3>
									<p className="mt-4 text-base leading-[1.8]">{value.text}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="bg-gainsboro py-[100px]">
				<div className="sp-container">
					<div className="mx-auto max-w-2xl border-2 border-ink bg-background px-[30px] py-16 text-center shadow-brut md:px-[90px]">
						<h2 className="font-title text-sp-3 md:text-sp-3-md">Come take a look</h2>
						<p className="mt-5 mb-[45px] text-sp-8 leading-[1.8]">
							Browse the whole shop or get in touch. We would love to hear from you.
						</p>
						<div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
							<Link href="/products" className="btn-brut btn-orange">
								<span>Shop now</span>
								<ArrowUpRight className="size-5" />
							</Link>
							{contactFormEnabled && (
								<Link href="/contact" className="btn-brut">
									Contact us
								</Link>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
