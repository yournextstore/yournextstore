import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getMostOrdered } from "@/lib/catalog";
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

	const featured = await getMostOrdered(4);

	return (
		<article>
			<JsonLdScript data={aboutJsonLd} />
			<div className="relative h-60 w-full overflow-hidden bg-muted lg:h-[460px]">
				<Image
					src="/images/pexels/about-sunlit-room.jpg"
					alt="A small bakery counter with loaves and pastries on wooden trays in morning sun"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
			</div>

			<section aria-labelledby="about-title" className="shell py-12 lg:py-20">
				<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center lg:gap-7">
					<p className="text-[11px] uppercase tracking-[0.18em] text-eyebrow">Our story · {storeName}</p>
					<h1
						id="about-title"
						className="font-display text-display-md font-semibold leading-[1.05] tracking-[-0.03em] lg:text-display-xl"
					>
						Baked early. Shared warm.
					</h1>
					<p className="text-body-md text-muted-foreground lg:text-body-lg">
						{storeDescription ??
							"A small neighbourhood bakery: slow-fermented bread, laminated pastries and simple cakes, baked every morning."}
					</p>
				</div>

				{featured.length > 0 && (
					<div className="mt-12 lg:mt-16">
						<h2 className="sr-only">From the shop</h2>
						<div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
							{featured.map((product) => (
								<ProductCard key={product.id} product={product} showSummary={false} />
							))}
						</div>
					</div>
				)}
			</section>

			<section aria-labelledby="values-title" className="bg-muted">
				<div className="shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12 lg:py-20">
					<h2 id="values-title" className="font-display text-display-sm font-semibold leading-[1.1]">
						What goes into every bake
					</h2>
					<div className="grid gap-8 sm:grid-cols-3">
						<div>
							<h3 className="font-semibold">Slow fermentation</h3>
							<p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
								Our doughs rest for up to 36 hours, for more flavour and a better crust.
							</p>
						</div>
						<div>
							<h3 className="font-semibold">Good ingredients</h3>
							<p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
								Stoneground flour, cultured butter and seasonal fruit, and nothing we would not bake with at
								home.
							</p>
						</div>
						<div>
							<h3 className="font-semibold">A short menu</h3>
							<p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
								A handful of breads, pastries and cakes we bake well, rather than a counter that never ends.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section
				aria-labelledby="cta-title"
				className="shell flex flex-col items-center gap-6 py-14 text-center lg:py-20"
			>
				<h2
					id="cta-title"
					className="font-display text-display-sm font-semibold leading-[1.1] lg:text-display-md"
				>
					Find something for the table
				</h2>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Link
						href="/products"
						className="inline-flex h-[52px] min-w-[170px] items-center justify-center rounded-[4px] bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
					>
						Browse the shop
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex h-[52px] min-w-[170px] items-center justify-center rounded-[4px] border border-border-strong px-7 font-semibold transition-colors hover:bg-secondary"
						>
							Contact us
						</Link>
					)}
				</div>
			</section>
		</article>
	);
}
