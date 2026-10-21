import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { PhotoTile } from "@/components/photo-tile";
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
			storeName: me.store.name || "our store",
			storeDescription: me.store.settings?.storeDescription || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return { storeName: "our store", storeDescription: null, contactFormEnabled: false };
	}
}

const VALUES = [
	{
		title: "A short list of scents",
		body: "A handful of perfumes rather than an endless wall of them, so each one has earned its place.",
	},
	{
		title: "Made to be worn",
		body: "Perfume for the skin, candles and incense for the room, all built on the same few accords.",
	},
	{
		title: "Quiet bottles",
		body: "Plain glass, black ceramic and no loud labels, made to sit quietly on a shelf.",
	},
];

/** The original has no about page; this one keeps its grammar: full-bleed frames and plain type on black. */
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
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<PhotoTile
				image="/images/pexels/about-shelves.jpg"
				mono
				sizes="100vw"
				priority
				className="h-[70svh] min-h-[24rem]"
			/>

			<section className="lg:grid lg:grid-cols-2">
				<div className="px-4 py-10 lg:px-[3.5vw] lg:py-[3vw]">
					<p className="text-foot text-muted-foreground">Stories 01</p>
					<h1 className="mt-2 text-nav">About {storeName}</h1>
					<div className="mt-[clamp(2rem,6vw,6rem)] max-w-[38rem] space-y-6 text-copy">
						{storeDescription && <p>{storeDescription}</p>}
						<p>
							We started with one smoky cedar we wanted to wear ourselves, and grew slowly from there. Every
							scent in the shop is one we would wear or burn every day: built from a few good materials and
							meant to become familiar.
						</p>
						<p>
							We would rather make a few scents well than many quickly, and we add to the range only when a
							new accord feels finished.
						</p>
					</div>
				</div>
				<PhotoTile
					image="/images/pexels/about-shadows.jpg"
					sizes="(max-width: 1023px) 100vw, 50vw"
					className="aspect-[4/5] lg:aspect-auto lg:h-svh"
				/>
			</section>

			<section aria-labelledby="values-heading" className="px-4 py-12 md:px-[2vw] md:py-[4vw]">
				<h2 id="values-heading" className="text-nav">
					What we hold to
				</h2>
				<div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-[2vw]">
					{VALUES.map((value) => (
						<div key={value.title} className="border-t border-snow pt-4">
							<h3 className="text-copy">{value.title}</h3>
							<p className="mt-3 text-copy text-muted-foreground">{value.body}</p>
						</div>
					))}
				</div>
				<div className="mt-12 flex flex-col gap-2 md:max-w-[48%]">
					<Link
						href="/products"
						className="group flex items-center justify-between border-b border-snow py-3 text-copy"
					>
						Shop all products
						<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
							→
						</span>
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="group flex items-center justify-between border-b border-snow py-3 text-copy"
						>
							Get in touch
							<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
								→
							</span>
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
