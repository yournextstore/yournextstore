import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { ABOUT_IMAGE, getShopInfo } from "@/lib/shop";

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

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${shop.storeName}`,
		description: shop.description ?? `About ${shop.storeName}.`,
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<div className="relative mx-auto h-[18rem] w-full max-w-[1600px] bg-stage md:h-[24rem]">
				<Image src={ABOUT_IMAGE} alt="" fill sizes="100vw" className="object-cover" priority />
			</div>
			<section className="container mx-auto px-6 py-16">
				<h1 className="nordic-title">About</h1>
				<div className="mt-8 max-w-3xl space-y-8 leading-relaxed">
					{shop.description && <p className="text-lg text-gray-800">{shop.description}</p>}
					<p>
						{shop.storeName} began with a simple idea borrowed from Nordic design: fewer things, chosen well,
						each one earning its place.
					</p>
					<p>
						We look for everyday pieces with plain forms and honest materials, things that sit quietly
						together and keep their use. Nothing shouts; everything has a job.
					</p>
				</div>

				<div className="mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
					{[
						{
							title: "Plain forms",
							text: "Shapes that do what they are for, and nothing more.",
						},
						{
							title: "Honest materials",
							text: "Materials chosen for how they look, feel and last.",
						},
						{
							title: "Room to breathe",
							text: "A smaller selection, so every piece is easy to find and easy to live with.",
						},
					].map((value) => (
						<div key={value.title}>
							<h2 className="font-bold text-gray-900">{value.title}</h2>
							<p className="mt-3 text-sm leading-relaxed">{value.text}</p>
						</div>
					))}
				</div>

				<div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-xl">
					<Link href="/products" className="nordic-link">
						visit the shop
					</Link>
					{shop.contactForm && (
						<Link href="/contact" className="nordic-link">
							get in touch
						</Link>
					)}
				</div>
			</section>
		</>
	);
}
