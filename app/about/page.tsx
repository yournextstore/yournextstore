import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
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

	const values = [
		{
			title: "Built for play",
			body: "Solid wood, tough finishes and rounded edges for rooms that get used.",
		},
		{ title: "Child-sized", body: "Heights, weights and handles scaled to the people who use them." },
		{ title: "Clear choices", body: "Straightforward product details, so you know what you are getting." },
	];

	return (
		<div className="shop-container py-16">
			<JsonLdScript data={aboutJsonLd} />

			<div className="border-b border-border pb-8">
				<p className="kicker mb-2">{storeName}</p>
				<h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-tight text-foreground">
					About Us
				</h1>
				{storeDescription && (
					<p className="mt-3 max-w-2xl text-lg text-muted-foreground">{storeDescription}</p>
				)}
			</div>

			<div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
				<section>
					<p className="kicker mb-2">Our story</p>
					<h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-foreground">
						Picked with <span className="text-brand-display">care.</span>
					</h2>
				</section>
				<div className="space-y-4 text-base leading-relaxed text-muted-foreground">
					<p>
						We design furniture and decor for children's rooms: chairs they can carry, storage they can reach
						and colours that make a room feel like theirs.
					</p>
					<p>
						We favour sturdy materials that wipe clean and hold up to climbing, and designs that still suit
						the room when the toddler becomes a schoolkid.
					</p>
				</div>
			</div>

			<section aria-labelledby="about-values" className="border-t border-border py-16">
				<h2 id="about-values" className="kicker mb-6">
					What we stand for
				</h2>
				<ul className="grid grid-cols-1 gap-5 sm:grid-cols-3">
					{values.map((value) => (
						<li key={value.title} className="rounded-2xl border border-border bg-card p-8">
							<h3 className="font-display text-xl font-semibold text-foreground">{value.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
						</li>
					))}
				</ul>
			</section>

			<div className="rounded-2xl border border-border bg-card px-8 py-14 text-center md:px-16">
				<p className="kicker mb-4">Keep exploring</p>
				<h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold text-foreground">
					Want to learn more?
				</h2>
				<p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
					Explore the catalogue{contactFormEnabled ? " or get in touch — we would love to hear from you" : ""}
					.
				</p>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/products"
						className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
					>
						Explore Collection <span aria-hidden>→</span>
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-brand hover:text-brand"
						>
							Contact us
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
