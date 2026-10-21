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
			title: "Chosen with care",
			body: "Every piece in the shop is picked for how it looks, how it feels and how long it lasts.",
		},
		{
			title: "Made to be used",
			body: "We look for things you reach for every day, not just for special occasions.",
		},
		{
			title: "Small and independent",
			body: "We are a small team that cares about every piece we put in the shop.",
		},
	];

	return (
		<div className="min-h-svh">
			<JsonLdScript data={aboutJsonLd} />
			<section className="bg-surface">
				<div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-14 text-center md:items-start md:px-8 md:py-20 md:text-left">
					<span className="mb-4 rounded-md bg-violet-soft px-4 py-1 text-sm font-semibold text-violet">
						About us
					</span>
					<h1 className="max-w-3xl text-kara-hero font-bold text-black [overflow-wrap:anywhere] md:text-kara-hero-lg">
						The Story Behind {storeName}
					</h1>
					<p className="mt-5 max-w-2xl text-lg leading-snug text-neutral-700">
						{storeDescription ??
							"We started this shop to gather the pieces we love in one place: well made, easy to wear and chosen with care."}
					</p>
				</div>
			</section>

			<section className="bg-card">
				<div className="mx-auto flex flex-col items-center px-4 py-12 md:container">
					<p className="mb-4 text-sm font-bold uppercase text-violet">What we stand for</p>
					<h2 className="mb-8 text-center text-kara-section font-bold text-black md:text-kara-section-lg">
						Our Values
					</h2>
					<div className="grid w-full max-w-[1150px] gap-3 md:grid-cols-3">
						{values.map((value) => (
							<div key={value.title} className="rounded-2xl bg-neutral-100 p-6">
								<h3 className="text-lg font-semibold text-black">{value.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-neutral-700">{value.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="kara-container py-12">
				<div className="mx-auto flex max-w-[1150px] flex-col items-center gap-3 bg-ink px-5 py-12 text-center text-white">
					<h2 className="text-2xl font-extrabold md:text-4xl">Find Something You Will Keep</h2>
					<p className="text-xs uppercase tracking-wide md:text-sm">The whole shop, in one place</p>
					<div className="mt-2 flex flex-col gap-3 sm:flex-row">
						<Link
							href="/products"
							className="rounded-lg bg-neutral-700 px-8 py-2 text-sm font-bold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-600"
						>
							Shop now
						</Link>
						{contactFormEnabled && (
							<Link
								href="/contact"
								className="rounded-lg border border-neutral-500 px-8 py-2 text-sm font-bold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-700"
							>
								Contact
							</Link>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
