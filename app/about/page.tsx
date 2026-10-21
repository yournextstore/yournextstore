import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { DisplayMedium } from "@/components/jam/display";
import { getCategoryTiles } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { PAGE, pluralize } from "@/lib/display";
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

	const [{ storeName, storeDescription, contactFormEnabled }, tiles] = await Promise.all([
		getStoreInfo(),
		getCategoryTiles(),
	]);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `About ${storeName} and the pieces we carry.`,
	};

	return (
		<div className={PAGE}>
			<JsonLdScript data={aboutJsonLd} />

			<section className="flex flex-col gap-8 bg-sky p-6 pb-10 sm:p-12 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-2xl">
					<div className="mb-10 border-l border-[#1a202c] px-3 pt-1">
						<p className="text-xs leading-tight tracking-wider uppercase">About</p>
						<p className="text-xs leading-tight tracking-wider">{storeName}</p>
					</div>
					<h1 className="text-4xl leading-[1.05] font-medium tracking-[0.12em] text-[#1f2933] xl:text-5xl">
						Pieces for every day
					</h1>
					<p className="mt-6 max-w-xl leading-7 text-[#1f2933]">
						{storeDescription ??
							`${storeName} gathers everyday essentials and accessories, one considered piece at a time.`}
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Link href="/products" className="jam-btn">
						Shop all
					</Link>
					{contactFormEnabled && (
						<Link href="/contact" className="jam-btn">
							Contact us
						</Link>
					)}
				</div>
			</section>

			<div className="grid gap-10 py-14 md:grid-cols-3">
				<div>
					<h2 className="text-3xl font-light text-foreground">How we choose</h2>
				</div>
				<div className="space-y-4 leading-7 text-muted-foreground md:col-span-2">
					<p>
						Every piece in the shop is picked to work on its own and alongside the rest: simple shapes, honest
						materials and details that suit everyday life rather than a showroom.
					</p>
					<p>
						Browse by category below, or see everything at once in the full catalogue. Each product page lists
						its price, options and availability, and checkout shows delivery choices for your address.
					</p>
				</div>
			</div>

			{tiles.length > 0 && (
				<section aria-labelledby="categories-heading">
					<h2 id="categories-heading" className="pb-8 text-4xl font-light text-foreground">
						All categories
					</h2>
					{/* Three across only when the tiles fill whole rows; otherwise two, so no tile sits alone. */}
					<div
						className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${tiles.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}
					>
						{tiles.map((tile) => (
							<DisplayMedium
								key={tile.href}
								href={tile.href}
								title={tile.title}
								subtitle={pluralize(tile.count, "item")}
								image={tile.image}
								headingLevel="h3"
							/>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
