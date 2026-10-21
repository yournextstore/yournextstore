import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { HeroHeadline } from "@/components/sections/hero-headline";
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

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			{/* The home hero's fitted word, set in ink on the page instead of over a photograph. */}
			<div className="border-b border-border pt-6 lg:pt-16">
				<HeroHeadline className="text-foreground">About</HeroHeadline>
			</div>

			<div className="page-container mt-10 grid grid-cols-12 gap-5 lg:mt-16 lg:gap-12">
				<div className="col-span-12 lg:col-span-5 xl:col-span-4">
					<p className="text-body">about us</p>
					<h2 className="mt-4 text-heading font-semibold lg:text-heading-lg">{storeName}</h2>
					{storeDescription && <p className="mt-4 text-body text-muted-foreground">{storeDescription}</p>}
				</div>

				<div className="col-span-12 space-y-10 lg:col-span-7 xl:col-span-8">
					<section>
						<h2 className="text-title font-semibold">Our story</h2>
						<div className="mt-3 max-w-2xl space-y-4 text-body text-muted-foreground">
							<p>
								We believe in the power of well-made things. Every piece in the store is chosen for the
								quality of its making and for how long it will stay in your wardrobe and your days.
							</p>
							<p>
								We work with makers who share our values: careful materials, honest production and designs
								that outlast a season.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-title font-semibold">What we stand for</h2>
						<ul className="mt-4 grid gap-4 sm:grid-cols-3">
							{[
								["Quality first", "Durable, well-made pieces we are proud to stand behind."],
								["Considered design", "Details that make everyday moments better."],
								["Honest service", "Real people, ready to help before and after your order."],
							].map(([title, text]) => (
								<li key={title} className="rounded-md bg-secondary px-4 pt-5 pb-6">
									<h3 className="text-body font-semibold">{title}</h3>
									<p className="mt-2 text-body text-muted-foreground">{text}</p>
								</li>
							))}
						</ul>
					</section>

					<div className="flex flex-wrap gap-2">
						<Link
							href="/products"
							className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-body font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
						>
							Shop all
						</Link>
						{contactFormEnabled && (
							<Link
								href="/contact"
								className="inline-flex h-10 items-center rounded-md border border-input px-4 text-body font-semibold transition-colors hover:bg-accent"
							>
								Contact us
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
