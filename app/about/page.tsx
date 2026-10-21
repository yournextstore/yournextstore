import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbBar, ListingTitle } from "@/components/listing";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { EDITORIAL } from "@/lib/editorial";
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

	const lead = EDITORIAL.aboutLead;
	const detail = EDITORIAL.aboutDetail;

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<BreadcrumbBar items={[{ label: "Home", href: "/" }, { label: "About" }]} />
			<ListingTitle lead="About" title={storeName} subtitle={storeDescription ?? undefined} />

			<section className="shell">
				<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-24">
					{lead && (
						<div className="relative aspect-[592/640] overflow-hidden rounded-lg">
							<Image
								src={lead.src}
								alt={lead.alt}
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 592px"
								className="object-cover"
							/>
						</div>
					)}
					<div className="max-w-lg">
						<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
							A small roastery with <em>island coffee</em> at its heart.
						</h2>
						<div className="mt-8 space-y-4 text-sm/7 text-muted-foreground">
							<p>
								We started with one idea: Indonesian coffee deserves to be tasted island by island. So we buy
								from growers in Sumatra, Java, Sulawesi, Bali and Flores and keep each lot on its own.
							</p>
							<p>
								We roast in small batches, write down the region, process and tasting notes on every bag, and
								stock only the brewing gear and cups we use at the roastery ourselves.
							</p>
						</div>
						<Link
							href="/products"
							className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm shadow-[0_1px_2px_rgb(0_0_0/0.12)] transition-colors hover:bg-secondary"
						>
							Explore All Products
						</Link>
					</div>
				</div>
			</section>

			<section className="shell mt-24 sm:mt-28 lg:mt-40">
				<div className="grid overflow-hidden rounded-lg md:grid-cols-2">
					<div className="flex flex-col justify-between gap-10 bg-orange p-6 text-orange-foreground lg:p-10">
						<h2 className="text-3xl leading-tight font-medium sm:text-4xl xl:text-5xl/none">
							What we stand for
						</h2>
						<ul className="grid gap-6 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
							{values.map((value, index) => (
								<li key={value.title}>
									<span className="text-sm/6">({index + 1})</span>
									<h3 className="mt-1 text-sm/6 uppercase">{value.title}</h3>
									<p className="mt-2 text-sm/6">{value.body}</p>
								</li>
							))}
						</ul>
					</div>
					{detail && (
						<div className="relative aspect-square md:aspect-auto">
							<Image
								src={detail.src}
								alt={detail.alt}
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
					)}
				</div>
			</section>

			<section className="shell mt-24 text-center sm:mt-28">
				<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
					Want to <em>know more</em>?
				</h2>
				<p className="mx-auto mt-4 max-w-md text-sm/6 text-muted-foreground">
					Browse the shop, read the answers to common questions, or get in touch.
				</p>
				<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<Link
						href="/products"
						className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-sm text-primary-foreground transition-colors hover:bg-black"
					>
						Shop Now
					</Link>
					<Link
						href={contactFormEnabled ? "/contact" : "/faq"}
						className="inline-flex h-11 items-center justify-center rounded-full border border-foreground px-7 text-sm transition-colors hover:bg-secondary"
					>
						{contactFormEnabled ? "Contact us" : "Read the FAQ"}
					</Link>
				</div>
			</section>
		</div>
	);
}

const values = [
	{
		title: "One origin at a time",
		body: "Each coffee comes from a single island and region, never blended out of sight.",
	},
	{ title: "Roasted with care", body: "Small batches, cupped before they reach the shop." },
	{
		title: "Clear & honest",
		body: "Region, process, roast and clear prices on every product.",
	},
];
