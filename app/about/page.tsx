import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Crumbs } from "@/components/crumbs";
import { getStoreSeo } from "@/lib/commerce";
import { ABOUT_BANNER, ABOUT_FRAMED } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import { getShopInfo } from "@/lib/shop";
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

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const shop = await getShopInfo();
	const { storeName, description: storeDescription, contactForm: contactFormEnabled } = shop;
	const banner = ABOUT_BANNER;
	const framed = ABOUT_FRAMED;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? "Learn about our story, our values, and the people behind the shop.",
	};

	return (
		<div className="min-h-svh">
			<JsonLdScript data={aboutJsonLd} />

			{/* Original About banner: a darkened photograph with the title centred on it. */}
			<div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#2b2b2b] md:h-64">
				{banner ? (
					<YNSMedia src={banner.src} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
				) : null}
				<h1 className="relative font-serif text-3xl font-semibold text-white">About Us</h1>
			</div>

			<div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
				<Crumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
				<div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-6">
					<div className="flex-1 space-y-8 md:text-lg">
						<section>
							<h2 className="mb-2 font-serif text-2xl font-semibold">Our Mission</h2>
							<p className="leading-relaxed">
								{storeDescription ??
									`${storeName} exists to make finding the right book feel like browsing a well-loved shop: unhurried, personal and full of small discoveries.`}{" "}
								Every item on our shelves is one we are glad to offer, shown plainly with its options and
								price.
							</p>
						</section>
						<section className="space-y-3">
							<h2 className="mb-2 font-serif text-2xl font-semibold">What We Are</h2>
							<p className="leading-relaxed">
								We are a small independent bookshop: fiction, non-fiction and children's books, plus a few
								reading goods. The shelves grow one considered addition at a time.
							</p>
							<p className="leading-relaxed">
								Wander the shelves, follow whatever catches your eye and take your time. If you have a
								question along the way, we would love to hear from you.
							</p>
						</section>
						<div className="flex flex-wrap gap-4">
							<Link href="/products" className="btn-shelf px-5 py-2 text-lg font-medium">
								Browse the Shelves
							</Link>
							{contactFormEnabled ? (
								<Link href="/contact" className="btn-outline-shelf border-2 px-5 py-2 text-lg font-medium">
									Contact Us
								</Link>
							) : null}
						</div>
					</div>
					{framed ? (
						<div className="mx-auto w-full max-w-sm bg-primary p-2 md:mx-0 md:w-96 md:shrink-0">
							<div className="relative aspect-square">
								<YNSMedia
									src={framed.src}
									alt={framed.alt}
									fill
									sizes="(min-width: 768px) 368px, 90vw"
									className="object-cover"
								/>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
