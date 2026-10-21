import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { collectionHasProducts } from "@/lib/catalog";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";
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
	const [me, collections, categories] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
	]);
	return {
		storeName: me?.store.name || "our store",
		storeDescription: me?.store.settings?.storeDescription || null,
		contactFormEnabled: me?.store.settings?.enabledTools?.contactForm ?? false,
		collections: collections.data
			.filter(collectionHasProducts)
			.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name })),
		categories: categories.data
			.filter((category) => !category.parentId)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	};
}

/** The text column: column 4 onwards from 1024px, like the header's links. */
const column = "col-span-2 lg:col-span-4 lg:col-start-4";

function LinkCard({
	id,
	title,
	links,
}: {
	id: string;
	title: string;
	links: { href: string; label: string }[];
}) {
	if (links.length === 0) return null;
	return (
		<section className="card grid-site content-start bg-brand pb-8 lg:min-h-96" aria-labelledby={id}>
			<h2 id={id} className={column}>
				{title}
			</h2>
			<ul className={`${column} mt-8 text-copy font-normal`}>
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="inline-block py-1 hover:underline">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled, collections, categories } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	const intro = storeDescription
		? [storeDescription]
		: [
				`${storeName} brings together everyday objects chosen for their materials, their design and the way they wear. Every piece is selected with meticulous attention to detail, for a harmonious blend of refined materials and understated elegance.`,
				"We favour designs that transcend trends: sophisticated, enduring pieces that are a pleasure to use every day.",
			];

	// The original's red cards on a deeper red ground; the header turns white and the footer black.
	return (
		<div data-flush data-ground="deep" className="m-1 flex flex-col gap-1 text-white">
			<JsonLdScript data={aboutJsonLd} />
			<h1 className="sr-only">About {storeName}</h1>
			<section className="card grid-site bg-brand pt-12 pb-4" aria-label="Our story">
				<div className={`${column} flex flex-col text-copy font-normal`}>
					{intro.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
			</section>
			<LinkCard id="collections" title="Collections" links={collections} />
			<section className="card grid-site content-start bg-brand pb-8 lg:min-h-[44rem]" aria-labelledby="more">
				<h2 id="more" className={column}>
					Shop
				</h2>
				<ul className={`${column} mt-8 text-copy font-normal`}>
					<li>
						<Link href="/products" className="inline-block py-1 hover:underline">
							All products
						</Link>
					</li>
					{categories.map((link) => (
						<li key={link.href}>
							<Link href={link.href} className="inline-block py-1 hover:underline">
								{link.label}
							</Link>
						</li>
					))}
					<li>
						<Link href="/faq" className="inline-block py-1 hover:underline">
							Questions and answers
						</Link>
					</li>
					{contactFormEnabled && (
						<li>
							<Link href="/contact" className="inline-block py-1 hover:underline">
								Contact us
							</Link>
						</li>
					)}
				</ul>
			</section>
		</div>
	);
}
