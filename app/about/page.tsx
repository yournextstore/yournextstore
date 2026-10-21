import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ShopCrumbs } from "@/components/shop-crumbs";
import { BalloonMark } from "@/components/wordmark";
import { ABOUT_PHOTOS } from "@/lib/catalog";
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

	const collage = ABOUT_PHOTOS;
	const name = storeName === "our store" ? "Our shop" : storeName;

	return (
		<div className="min-h-svh">
			<JsonLdScript data={aboutJsonLd} />
			<ShopCrumbs trail={[{ href: "/", label: "Home" }]} current="About us" />

			<div className="frame mt-6 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,250px)_minmax(0,1fr)] lg:gap-10">
				{/* The original's illustration column: a loose stack of bundled lifestyle photographs */}
				<div className="relative mx-auto h-[300px] w-[250px] md:h-[440px]" aria-hidden>
					{collage.map((src, i) => (
						<div
							key={src}
							className={[
								"absolute overflow-hidden rounded-[20px] border-4 border-white shadow-xl",
								i === 0 && "left-0 top-0 h-36 w-40 -rotate-6 md:h-44 md:w-48",
								i === 1 && "right-0 top-24 h-40 w-36 rotate-3 md:top-36 md:h-48 md:w-40",
								i === 2 && "bottom-0 left-4 h-28 w-40 -rotate-2 md:h-36 md:w-48",
							]
								.filter(Boolean)
								.join(" ")}
						>
							<Image src={src} alt="" fill sizes="200px" className="object-cover" />
						</div>
					))}
					<BalloonMark className="absolute -right-2 bottom-6 h-16 w-auto md:bottom-10" />
				</div>

				<div className="text-ink">
					<h1 className="sr-only">About us</h1>
					<p className="text-xl font-bold leading-snug md:text-[22px] md:leading-[1.27]">
						{storeDescription ??
							`${name} is a small online shop with a big catalogue of things for everyday life. We put every product here because we think it earns its place at home.`}
					</p>
					<section className="mt-6">
						<h2 className="text-lg font-bold underline underline-offset-4 md:text-xl">
							A catalogue that is easy to browse
						</h2>
						<p className="mt-3 text-sm leading-6">
							Every product sits in a category and many in a collection, so you can go from a whole collection
							to the one piece you were looking for in a couple of clicks. Search the catalogue from the top
							of any page.
						</p>
					</section>
					<section className="mt-6">
						<h2 className="text-lg font-bold underline underline-offset-4 md:text-xl">
							Prices you can see up front
						</h2>
						<p className="mt-3 text-sm leading-6">
							Product pages show the current price and whether an item is in stock, and your cart keeps a
							running total, so you know where you stand before you reach checkout.
						</p>
					</section>
					<section className="mt-6">
						<h2 className="text-lg font-bold underline underline-offset-4 md:text-xl">
							A checkout that keeps it short
						</h2>
						<p className="mt-3 text-sm leading-6">
							Add what you like to the cart, review it in one place and pay through a secure hosted checkout.
							Your account lets you come back to your orders any time.
						</p>
					</section>
					<div className="mt-10 flex flex-wrap gap-4">
						<Link href="/products" className="pill pill-primary h-[50px] px-8 text-lg">
							Go to shop
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="pill pill-outline h-[50px] px-8 text-lg">
								Contact us
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
