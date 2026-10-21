import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ListingHeader } from "@/components/listing-header";
import { getStoreBrand } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { ABOUT_IMAGE } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import {
	btnPrimaryClass,
	btnSecondaryClass,
	eyebrowClass,
	pageContainerClass,
	sectionTitleClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";
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
	{
		title: "Chosen with Care",
		copy: "Every bear, bunny and fox is chosen for its fabric, its face and how it feels in the arms.",
	},
	{
		title: "Made for Hugging",
		copy: "Soft enough for the cot and sturdy enough for daily play, from a pocket bunny to a jointed bear.",
	},
	{
		title: "Made to Last",
		copy: "Mohair, alpaca, velvet and linen in classic shapes, so a first friend can become a family keepsake.",
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const brand = await getStoreBrand();
	const image = ABOUT_IMAGE;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${brand.name}`,
		description: brand.description,
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<ListingHeader eyebrow="Our Story" title={`About ${brand.name}`}>
				{brand.description}
			</ListingHeader>

			<section className={cn(pageContainerClass, "grid items-center gap-12 lg:grid-cols-2 lg:gap-20")}>
				<div>
					<p className={eyebrowClass}>Our Philosophy</p>
					<h2 className={cn(sectionTitleClass, "mb-6")}>
						Friends worth <em>keeping</em>
					</h2>
					<div className="space-y-4 font-body text-base leading-relaxed text-earth">
						<p>
							At {brand.name}, we believe a soft toy should be hugged every day and still be loved years from
							now, then handed on.
						</p>
						<p>
							We started with a simple wish: a toy shop where every bear, bunny and fox has a real face and a
							fabric you want to touch. So we keep the shelves small and make each friend in limited runs.
						</p>
					</div>
				</div>
				{image && (
					<div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-sand shadow-luxury-lg">
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
							priority
						/>
					</div>
				)}
			</section>

			<section className="bg-royal/5 py-20">
				<div className="mx-auto max-w-7xl px-6 lg:px-12">
					<div className="mb-12 text-center">
						<p className={eyebrowClass}>What We Stand For</p>
						<h2 className={sectionTitleClass}>Our Values</h2>
					</div>
					<div className="grid gap-4 md:grid-cols-3 lg:gap-6">
						{VALUES.map((value, index) => (
							<div key={value.title} className="rounded-2xl border border-earth/5 bg-card/60 p-8">
								<p className="font-display text-4xl text-crimson">0{index + 1}</p>
								<h3 className="mt-3 mb-2 font-display text-2xl text-royal">{value.title}</h3>
								<p className="font-body text-sm leading-relaxed text-earth">{value.copy}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className={cn(pageContainerClass, "pb-32 text-center")}>
				<p className={eyebrowClass}>Say Hello</p>
				<h2 className={cn(sectionTitleClass, "mb-4")}>Come and Say Hello</h2>
				<p className="mx-auto mb-8 max-w-xl font-body text-base leading-loose tracking-wide text-earth-soft">
					Browse the shop, or get in touch — we would love to help you find something worth keeping.
				</p>
				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link href="/products" className={btnPrimaryClass}>
						Explore the Shop
					</Link>
					{brand.contact && (
						<Link href="/contact" className={btnSecondaryClass}>
							Contact Us
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
