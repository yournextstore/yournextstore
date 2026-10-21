import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
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
			icon: Leaf,
			title: "Considered Quality",
			text: "Every piece we offer is chosen for how it looks, how it is made and how often you will reach for it.",
		},
		{
			icon: Heart,
			title: "Chosen with Passion",
			text: "We look at far more than we stock, and keep only the few that earn a place in your day.",
		},
		{
			icon: Sparkles,
			title: "Made to Be Used",
			text: "Things for everyday life, not for the back of a cupboard: easy to use, easy to live with.",
		},
	];

	return (
		<div className="mx-auto max-w-[720px] px-4 py-16 sm:py-20">
			<JsonLdScript data={aboutJsonLd} />

			<h1 className="font-display text-4xl font-bold text-foreground">About {storeName}</h1>
			<p className="mt-6 text-lg leading-relaxed text-muted-foreground">
				{storeDescription ??
					`At ${storeName}, we believe the things you use every day should be worth the attention. We keep a short list of loose-leaf teas from named gardens, and the teaware to brew them well.`}
			</p>

			<ul className="mt-10 grid gap-6 sm:grid-cols-3">
				{values.map(({ icon: Icon, title, text }) => (
					<li key={title} className="rounded-lg border border-border/60 bg-card p-6 text-center">
						<Icon aria-hidden="true" className="mx-auto size-8 text-gold-ink" strokeWidth={1.5} />
						<h2 className="mt-3 font-display text-lg font-bold text-foreground">{title}</h2>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
					</li>
				))}
			</ul>

			<section className="mt-16">
				<h2 className="mb-5 font-display text-2xl font-bold text-foreground">Our Story</h2>
				<div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
					<p>
						{storeName} was born from a simple belief: everyday things deserve as much care as special ones.
						What started as a short list of favourites grew into a shop for anyone who prefers fewer, better
						things.
					</p>
					<p>
						We look for clear materials, honest finishes and shapes that still feel right after the hundredth
						use, and we describe every piece plainly so you know what you are getting.
					</p>
					<p>Browse the range, read the FAQ, and if a question is still open, ask us before you buy.</p>
				</div>
			</section>

			<div className="mt-14 flex flex-col gap-3 sm:flex-row">
				<Link
					href="/products"
					className="inline-flex h-11 items-center justify-center gap-2 bg-accent px-8 text-sm font-medium uppercase tracking-widest text-accent-foreground transition-colors hover:bg-accent/85"
				>
					Shop the Collection
					<ArrowRight aria-hidden="true" className="size-4" />
				</Link>
				{contactFormEnabled && (
					<Link
						href="/contact"
						className="inline-flex h-11 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
					>
						Contact us
					</Link>
				)}
			</div>
		</div>
	);
}
