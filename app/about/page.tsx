import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

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

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={aboutJsonLd} />

			{/* Header */}
			<div className="mb-10">
				<YnsLink
					prefetch="eager"
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Home
				</YnsLink>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">About Us</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">About Us</h1>
				{storeDescription && <p className="mt-3 text-lg text-muted-foreground">{storeDescription}</p>}
			</div>

			{/* Story */}
			<div className="space-y-12">
				<section>
					<h2 className="text-2xl font-medium tracking-tight mb-4">Our Story</h2>
					<div className="space-y-4 text-muted-foreground leading-relaxed">
						<p>
							We believe in the power of thoughtful design. Every product in our collection is carefully
							selected to bring quality, beauty, and functionality into your everyday life.
						</p>
						<p>
							Our commitment to craftsmanship means we partner with makers who share our values — those who
							prioritize sustainable materials, ethical production, and timeless design over fleeting trends.
						</p>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-medium tracking-tight mb-4">What We Stand For</h2>
					<div className="grid gap-6 sm:grid-cols-3">
						<div>
							<h3 className="text-base font-medium text-foreground">Quality first</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								Durable, well-made products we are proud to stand behind.
							</p>
						</div>
						<div>
							<h3 className="text-base font-medium text-foreground">Thoughtful design</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								Considered details that make everyday moments better.
							</p>
						</div>
						<div>
							<h3 className="text-base font-medium text-foreground">Honest service</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								Real people, ready to help before and after your order.
							</p>
						</div>
					</div>
				</section>
			</div>

			{/* CTA */}
			<div className="mt-16 rounded-lg border border-border bg-secondary/30 p-8 text-center">
				<h2 className="text-2xl font-medium tracking-tight">Want to learn more?</h2>
				<p className="mt-2 text-muted-foreground">
					Explore our products or get in touch — we would love to hear from you.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<YnsLink
						prefetch="eager"
						href="/products"
						className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 font-medium text-background transition-all hover:bg-foreground/90"
					>
						Shop products
					</YnsLink>
					{contactFormEnabled && (
						<YnsLink
							prefetch="eager"
							href="/contact"
							className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 font-medium text-foreground transition-colors hover:bg-secondary"
						>
							Contact us
						</YnsLink>
					)}
				</div>
			</div>
		</div>
	);
}
