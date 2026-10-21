import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FeaturedCategoriesSection } from "@/components/sections/home-sections";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_IMAGE } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
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
	const heroImage = ABOUT_IMAGE;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<div className="shop-container">
				<Breadcrumbs
					className="py-4 md:pt-8"
					items={[
						{ label: "Home", href: "/" },
						{ label: "About Us", href: "/about" },
					]}
				/>
			</div>

			<section className="bg-secondary/20">
				<div className="mx-auto max-w-shop px-4 py-12 sm:py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
					<div className="space-y-6 lg:px-4">
						<div className="space-y-4">
							<h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl xl:text-6xl">
								About {storeName}
							</h1>
							<p className="max-w-md text-lg text-balance text-muted-foreground lg:text-xl">
								{storeDescription ?? "Products we believe in, chosen with care and delivered to your door."}
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Link
								href="/products"
								className="inline-flex h-12 items-center justify-center rounded-md bg-ink px-8 text-base font-medium text-white transition-colors hover:bg-ink-hover"
							>
								Shop All Products
							</Link>
							{contactFormEnabled && (
								<Link
									href="/contact"
									className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium text-foreground transition-colors hover:bg-accent"
								>
									Contact Us
								</Link>
							)}
						</div>
					</div>
					{heroImage && (
						<div className="relative mt-10 hidden h-[460px] overflow-hidden rounded-lg bg-white lg:mt-0 lg:block">
							<YNSMedia src={heroImage} alt="" fill sizes="600px" className="object-cover" priority />
						</div>
					)}
				</div>
			</section>

			<section className="wide-container py-16 sm:py-20 lg:py-24">
				<div className="mb-12 max-w-2xl">
					<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Our Story</h2>
					<div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
						<p>
							We started with a simple question on every trip: what actually earned its place in the pack?
							Every product in our range is chosen for weight, durability and how well it works outside.
						</p>
						<p>
							We list the specs that matter, from packed weight to capacity and materials, so you can compare
							gear clearly and pick what suits your next trip.
						</p>
					</div>
				</div>
				<div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
					{VALUES.map((value) => (
						<div
							key={value.title}
							className="flex flex-col rounded-lg bg-linear-to-b from-transparent to-primary/5 p-6 ring-1 ring-border"
						>
							<h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p>
						</div>
					))}
				</div>
			</section>

			<FeaturedCategoriesSection />
		</div>
	);
}

const VALUES = [
	{ title: "Quality first", text: "Durable, well-made products we are proud to stand behind." },
	{ title: "Thoughtful design", text: "Considered details that make camp and trail days easier." },
	{ title: "Honest service", text: "Real people, ready to help before and after your order." },
];
