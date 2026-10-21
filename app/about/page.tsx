import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getCatalogEntries, getStoreInfo as getCatalogInfo, getProductCount } from "@/lib/catalog";
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

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");
	const [{ storeName, storeDescription, contactFormEnabled }, info, entries, count] = await Promise.all([
		getStoreInfo(),
		getCatalogInfo(),
		getCatalogEntries(),
		getProductCount(),
	]);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	const stats = [
		{ value: String(count), label: count === 1 ? "product in the catalog" : "products in the catalog" },
		{
			value: String(entries.length),
			label: entries.some((entry) => entry.href.startsWith("/category/"))
				? entries.length === 1
					? "category"
					: "categories"
				: entries.length === 1
					? "collection"
					: "collections",
		},
		...(info.freeShipping ? [{ value: info.freeShipping, label: "for free shipping" }] : []),
	];

	return (
		<div className="pb-10 lg:pb-[70px]">
			<JsonLdScript data={aboutJsonLd} />
			<div className="uk-container">
				<nav aria-label="Breadcrumb" className="pt-5 pb-5 text-center sm:pt-10 lg:pb-[30px]">
					<ol className="flex justify-center text-uk-sm text-muted-foreground">
						<li>
							<Link href="/" className="hover:text-foreground">
								Home
							</Link>
						</li>
						<li aria-hidden className="mx-5">
							/
						</li>
						<li aria-current="page" className="text-foreground">
							About
						</li>
					</ol>
				</nav>
				<article className="uk-card px-5 py-10 sm:px-10 lg:py-[70px]">
					<div className="mx-auto max-w-[640px]">
						<h1 className="text-center text-uk-h1">About</h1>
						<p className="mt-5 text-center text-uk-lg leading-relaxed text-foreground lg:text-[1.5rem]">
							{storeDescription ??
								`${storeName} is a shop built around one simple catalog: clear prices, honest stock, and a quick way to check out.`}
						</p>
						<p className="mt-5 text-uk-sm leading-relaxed">
							We keep the range focused and every product page complete: photographs, a short summary, what is
							in stock and what it costs before you reach the checkout. Payment runs through a secure,
							encrypted checkout, and every order can be followed from your account.
						</p>

						<h2 className="mt-10 text-center text-uk-h2 lg:text-[2rem]">Our principles</h2>
						<ul className="mt-5 list-disc space-y-[10px] pl-5 text-uk-sm leading-relaxed">
							<li>
								Clear information first. Prices are shown up front, and shipping options appear before you
								pay.
							</li>
							<li>Only what we can deliver. Stock levels on the product page are the stock we have.</li>
							<li>Answers when you need them. The FAQ covers orders, payment and delivery.</li>
						</ul>
					</div>

					<h2 className="mt-10 text-center text-uk-h2 lg:text-[2rem]">Some numbers</h2>
					<ul className="mt-5 grid grid-cols-1 gap-5 text-center sm:grid-cols-3">
						{stats.map((stat) => (
							<li key={stat.label}>
								<p className="text-[3rem] leading-tight font-light text-primary">{stat.value}</p>
								<p className="text-uk-sm text-foreground">{stat.label}</p>
							</li>
						))}
					</ul>

					<div className="mx-auto mt-10 flex max-w-[640px] flex-col justify-center gap-[10px] sm:flex-row">
						<Link href="/products" className="uk-btn uk-btn-primary">
							Shop the catalog
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="uk-btn uk-btn-default">
								Contact us
							</Link>
						)}
						<Link href="/faq" className="uk-btn uk-btn-default">
							Read the FAQ
						</Link>
					</div>
				</article>
			</div>
		</div>
	);
}
