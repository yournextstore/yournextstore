import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Crumbs } from "@/components/crumbs";
import { Button } from "@/components/ui/button";
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
			title: "Made to be lived with",
			body: "Bags built for daily use: dense canvas, recycled nylon and leather that age well.",
		},
		{
			title: "Designed to work together",
			body: "Bags, pouches and cubes that share colours and sizes, so they pack and carry together.",
		},
		{
			title: "Answers when you need them",
			body: "Questions about a capacity, a material or an order? Ask us before or after you buy.",
		},
	];

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section className="border-b border-border">
				<div className="shell py-12 text-center md:py-24">
					<Crumbs
						className="mb-8 flex justify-center"
						items={[{ label: "Home", href: "/" }, { label: "About" }]}
					/>
					<h1 className="text-4xl font-bold tracking-tight text-ink text-balance md:text-5xl">
						About {storeName}
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
						{storeDescription ??
							"A small team that believes everyday things should feel calm, practical and entirely yours, without costing a fortune."}
					</p>
				</div>
			</section>

			<section className="shell grid gap-8 py-16 md:grid-cols-5 md:gap-12">
				<h2 className="text-2xl font-bold text-ink md:col-span-2">Our story</h2>
				<div className="space-y-4 leading-7 text-ink-soft md:col-span-3">
					<p>
						We started with a simple frustration: too often you had to choose between things that looked good
						and things that lasted. So we began collecting the ones that did both, from backpacks that survive
						every commute to the pouch you reach for every day.
					</p>
					<p>
						Each product is picked for how it works day to day, and grouped into collections so you can find
						what fits together with confidence.
					</p>
				</div>
			</section>

			<section className="shell pb-16">
				<h2 className="mb-8 text-2xl font-bold text-ink">What we stand for</h2>
				<ul className="grid gap-4 md:grid-cols-3">
					{values.map((value) => (
						<li key={value.title} className="rounded-lg border border-border bg-wash px-5 py-4">
							<h3 className="font-semibold text-ink">{value.title}</h3>
							<p className="mt-1 text-sm text-ink-soft">{value.body}</p>
						</li>
					))}
				</ul>
			</section>

			<section className="bg-ink text-white">
				<div className="shell flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-2xl font-bold">Ready to find your next bag?</h2>
						<p className="mt-2 text-gray-300">Browse the full range, or get in touch with a question.</p>
					</div>
					<div className="flex flex-wrap gap-4">
						<Button size="lg" asChild className="bg-white text-ink hover:bg-white/90">
							<Link href="/products">Shop products</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							asChild
							className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
						>
							<Link href={contactFormEnabled ? "/contact" : "/faq"}>
								{contactFormEnabled ? "Contact us" : "Read the FAQ"}
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
