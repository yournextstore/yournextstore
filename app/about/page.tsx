import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { BrandMark } from "@/components/njx/brand-mark";
import {
	editorial,
	getAllCategories,
	getCollections,
	getFreeShippingLabel,
	getStoreInfo,
	monogram,
} from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName}: who we are and how we work.`;

	return {
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: { type: "website", title: "About", description, url: "/about" },
	};
}

async function getAboutData() {
	"use cache";
	cacheLife("hours");
	const [store, collections, categories, products, freeShipping] = await Promise.all([
		getStoreInfo(),
		getCollections(),
		getAllCategories(),
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => null),
		getFreeShippingLabel(),
	]);
	const image = editorial.about;
	return {
		store,
		image,
		freeShipping,
		numbers: [
			{ num: String(products?.meta.count ?? 0), label: "products in the shop" },
			{ num: String(collections.length), label: collections.length === 1 ? "collection" : "collections" },
			{ num: String(categories.length), label: "categories to browse" },
		],
	};
}

export default async function AboutPage() {
	const { store, image, freeShipping, numbers } = await getAboutData();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${store.name}`,
		description: store.description ?? `Who makes ${store.name} and how we work.`,
	};

	const howItems = [
		{
			strong: "Browse freely.",
			text: "No account needed to look around or to check out.",
		},
		{
			strong: freeShipping ? `Free shipping over ${freeShipping}.` : "Shipping, kept simple.",
			text: "Delivery options and costs are shown at checkout, before you pay.",
		},
		{
			strong: "Secure checkout.",
			text: "Cards and local payment methods are handled by our payment provider; we see the order, never the card.",
		},
		{
			strong: "Policies in plain sight.",
			text: "Shipping and return terms are on our policy pages, linked at the bottom of every page.",
		},
	];

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-6 pb-4 sm:pb-8 md:grid-cols-[1.1fr_1fr] md:pt-12">
				<div>
					<BrandMark letter={monogram(store.name)} className="mb-6 h-16 w-16 rounded-xl text-[34px]" />
					<h1 className="font-display text-[clamp(36px,5vw,60px)] leading-[1.02] font-extrabold tracking-tight">
						A small shop for the things we reach for every day.
					</h1>
					{store.description ? (
						<p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
							{store.description}
						</p>
					) : null}
					<p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						{store.name} makes a short list of gear for the workbench and the desk, each item photographed and
						described plainly so you know what you are getting.
					</p>
				</div>
				<div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-tile">
					{image ? (
						<YNSMedia
							src={image}
							alt={`A maker's desk and workbench set up with ${store.name} gear`}
							fill
							priority
							sizes="(max-width: 768px) 100vw, 510px"
							className="object-cover"
						/>
					) : null}
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-5">
				<dl className="grid grid-cols-3 gap-6 rounded-2xl border border-line bg-tile/60 p-5 text-center sm:grid-cols-3 sm:gap-8 sm:p-10">
					{numbers.map((n) => (
						<div key={n.label} className="flex flex-col-reverse">
							<dt className="mt-1 text-[14px] text-muted-foreground">{n.label}</dt>
							<dd className="font-display text-3xl font-bold text-pine-ink">{n.num}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-4 sm:pt-8">
				<div className="grid gap-6 rounded-2xl border border-line bg-tile/60 p-5 sm:gap-10 sm:p-10 md:grid-cols-2">
					<div>
						<p className="text-[13px] font-medium text-pine-ink">The honest part</p>
						<h2 className="mt-3 font-display text-[clamp(24px,3vw,32px)] leading-tight font-bold tracking-tight">
							Fewer things, chosen properly.
						</h2>
						<p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
							We would rather sell a short list of things we trust than a long one we have to explain.
							Everything here is something{" "}
							<strong className="font-semibold text-ink">we are happy to stand behind</strong>, described as
							it is.
						</p>
						<Link
							href="/products"
							className="mt-6 inline-block rounded-md bg-pine px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-pine-deep"
						>
							Browse the shop
						</Link>
					</div>
					<div>
						<h3 className="text-[16px] font-semibold">How ordering works</h3>
						<ul className="mt-4 grid gap-4 text-[14px] leading-relaxed text-muted-foreground">
							{howItems.map((item) => (
								<li key={item.strong} className="flex gap-3">
									<span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pine" />
									<span>
										<strong className="font-medium text-ink">{item.strong}</strong> {item.text}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:py-14">
				<h2 className="font-display text-2xl font-bold">Want to say hi?</h2>
				<p className="text-[15px] text-muted-foreground">Send us a message and we will get back to you.</p>
				<Link
					href={store.contactForm ? "/contact" : "/faq"}
					className="rounded-md bg-pine px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-pine-deep"
				>
					{store.contactForm ? "Contact us" : "Read the FAQ"}
				</Link>
			</section>
		</>
	);
}
