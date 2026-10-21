import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import aboutStudio from "@/public/images/pexels/about-khaki-studio.jpg";
import aboutStairs from "@/public/images/pexels/about-trench-stairs.jpg";

const frames = [aboutStairs, aboutStudio];

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

	const [{ storeName, storeDescription, contactFormEnabled }, categories] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
	]);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `The story behind ${storeName}.`,
	};

	return (
		<div className="mx-auto max-w-screen-2xl px-5 pt-10 max-[400px]:px-3">
			<JsonLdScript data={aboutJsonLd} />
			<div className="my-10 flex items-center justify-center bg-taupe px-4 py-10 text-white">
				<h1 className="text-center text-3xl max-sm:text-2xl">About Us</h1>
			</div>

			<div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 lg:grid-cols-2">
				<div className="grid grid-cols-2 gap-2">
					{frames.map((frame, index) => (
						<div key={frame.src} className="relative aspect-[2/3] overflow-hidden bg-secondary">
							<Image
								src={frame}
								alt=""
								fill
								placeholder="blur"
								sizes="(max-width: 1024px) 50vw, 25vw"
								className="object-cover"
								priority={index === 0}
							/>
						</div>
					))}
				</div>
				<div className="flex flex-col gap-6">
					<h2 className="text-5xl tracking-[1.56px] max-sm:text-4xl">Our Story</h2>
					{storeDescription && <p className="text-xl leading-relaxed">{storeDescription}</p>}
					<p className="text-lg leading-relaxed">
						{storeName} brings together pieces chosen for their materials, their making and the way they fit
						into everyday life. Every product in the shop is photographed and described with care, so you can
						see exactly what you are choosing.
					</p>
					<p className="text-lg leading-relaxed">
						Browse the collection by category, or get in touch if you would like to know more about a piece.
					</p>
					<div className="mt-2 flex w-full max-w-md flex-col gap-1 sm:flex-row sm:gap-3">
						<Link href="/products" className="btn-taupe">
							Shop Now
						</Link>
						{contactFormEnabled ? (
							<Link href="/contact" className="btn-white">
								Contact Us
							</Link>
						) : (
							<Link href="/faq" className="btn-white">
								Read the FAQ
							</Link>
						)}
					</div>
				</div>
			</div>

			{categories.length > 0 && (
				<section className="mt-24">
					<h2 className="mb-8 text-center text-4xl max-sm:text-3xl">Shop by Category</h2>
					<ul className="flex flex-wrap justify-center gap-3">
						{categories.map((category) => (
							<li key={category.slug}>
								<Link
									href={`/category/${category.slug}`}
									className="block border border-taupe px-5 py-2 transition-colors hover:bg-taupe hover:text-white"
								>
									{category.name}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
}
