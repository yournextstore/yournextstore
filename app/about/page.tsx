import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ListingBanner } from "@/components/listing-banner";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { EDITORIAL } from "@/lib/editorial";
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

	const values = [
		{
			title: "A short list",
			body: "A handful of scents we know well, each tested for weeks before it joins the shop.",
		},
		{
			title: "Soy wax, cotton wicks",
			body: "Poured by hand in small batches, so every candle burns slowly, evenly and cleanly.",
		},
		{
			title: "Every evening",
			body: "Made to be lit on an ordinary Tuesday, not saved for a special occasion.",
		},
	];

	return (
		<div className="pb-20 sm:pb-28">
			<JsonLdScript data={aboutJsonLd} />
			<ListingBanner
				title={`About ${storeName}`}
				image={EDITORIAL.about.src}
				lede={storeDescription ?? undefined}
			/>

			<div className="container grid gap-10 pt-14 sm:pt-20 lg:grid-cols-2 lg:gap-20">
				<h2 className="text-section sm:text-[2.34rem]">Small comforts for slow, simple days</h2>
				<div className="space-y-4 text-body">
					<p>
						We pour candles for the small moment that changes how an evening feels: a wick lit after work, a
						green scent in a quiet room. Every jar is meant to be burned down to the last of the wax.
					</p>
					<p>
						We keep our scents calm and close to nature: fern, moss, linen, fig leaf and cedar. When a jar is
						empty, it is worth keeping for tea lights, pens or a few stems.
					</p>
				</div>
			</div>

			<div className="container mt-14 grid gap-5 sm:mt-20 sm:grid-cols-3">
				{values.map((value) => (
					<div key={value.title} className="rounded-lg bg-[#efe8de] p-6 sm:p-8">
						<h3 className="font-heading text-[1.5rem] font-semibold">{value.title}</h3>
						<p className="mt-2 text-body">{value.body}</p>
					</div>
				))}
			</div>

			<div className="container mt-14 flex flex-col items-start gap-5 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-section sm:text-[2.34rem]">Find your favourite</h2>
				<div className="flex flex-wrap gap-3">
					<Link
						href="/products"
						className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Shop products
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex h-11 items-center rounded-lg border border-foreground px-5 text-base font-semibold transition-colors hover:bg-secondary"
						>
							Contact us
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
