import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { HalfHero, ImageTiles, PhotoBand } from "@/components/sections/home";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { editorial } from "@/lib/editorial";
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

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [identity, categories] = await Promise.all([getStoreIdentity(), getCatalogCategories()]);
	const { storeName, storeDescription, contactFormEnabled } = identity;

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
			<PhotoBand frames={editorial.aboutBand} className="h-[22rem] md:h-[25rem]">
				<p className="bp-superheading">Our story</p>
				<h1 className="bp-h1 mt-3">About {storeName}</h1>
			</PhotoBand>

			<section className="bp-container py-12 md:py-16">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="bp-h3">Welcome to {storeName}</h2>
					<p className="mt-5 text-base leading-7">
						{storeDescription ??
							"Every layer we make is worn on real walks first: fabrics that feel good next to skin, details that hold up on rough paths, and fits you will wear all week."}
					</p>
					<p className="mt-4 text-base leading-7">
						We work with makers who share our values and put quality before quantity, so what arrives at your
						door is something worth keeping.
					</p>
				</div>
			</section>

			<HalfHero
				image={editorial.aboutHalf}
				superheading="What we stand for"
				heading="Made for Real Days Outside"
				body="Quality first, thoughtful design and honest service: real people, ready to help before and after your order."
				cta="Shop the collection"
				href="/products"
			/>

			<ImageTiles categories={categories} />

			<section className="bp-container py-12 text-center md:py-16">
				<h2 className="bp-h3">Want to Learn More?</h2>
				<p className="mx-auto mt-4 max-w-xl text-base">
					Explore the full range, or get in touch: we would love to hear from you.
				</p>
				<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<Link href="/products" className="bp-btn">
						Shop products
					</Link>
					{contactFormEnabled ? (
						<Link href="/contact" className="bp-btn bp-btn-inverse-dark">
							Contact us
						</Link>
					) : (
						<Link href="/faq" className="bp-btn bp-btn-inverse-dark">
							Read the FAQ
						</Link>
					)}
				</div>
			</section>
		</>
	);
}
