import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { headingSizes, pill } from "@/components/munch/styles";
import { Marquee, MediaText } from "@/components/sections/home";
import { EDITORIAL, getHomeCollections, getNavCategories, richTextToPlain } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

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
			storeDescription: me.store.settings?.storeDescription?.trim() || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return { storeName: "our store", storeDescription: null, contactFormEnabled: false };
	}
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [{ storeName, storeDescription, contactFormEnabled }, collections, categories] = await Promise.all([
		getStoreInfo(),
		getHomeCollections(),
		getNavCategories(),
	]);
	const blocks = collections.slice(0, 2);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			{/* The original's simple hero: a blush panel with the headline beside a square photograph. */}
			<section className="shell py-m">
				<div className="flex flex-col items-stretch justify-center gap-xs lg:flex-row-reverse">
					<div className="flex min-h-117.5 w-full flex-col items-center justify-center gap-s rounded-lg bg-blush px-m py-4xl text-center lg:w-1/2 lg:py-m">
						<h1 className={cn(headingSizes.hero, "text-foreground")}>About us</h1>
						<p className="max-w-145 text-center text-b-lg leading-[1.5] text-balance lg:text-b-xl">
							{storeDescription ?? `Everything at ${storeName} is chosen with care, one piece at a time.`}
						</p>
						<div className="mt-lg flex flex-wrap justify-center gap-s">
							<Link href="/products" className={pill({ size: "md", variant: "primary" })}>
								Shop now
							</Link>
							{contactFormEnabled && (
								<Link href="/contact" className={pill({ size: "md", variant: "outline-ink" })}>
									Contact us
								</Link>
							)}
						</div>
					</div>
					<div className="relative aspect-square overflow-hidden rounded-lg bg-[#f4ebdb] lg:w-1/2">
						<Image
							src={EDITORIAL.about}
							alt=""
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
				</div>
			</section>
			<Marquee words={[storeName, ...categories.map((category) => category.name)]} />
			{blocks.map((entry, index) => (
				<MediaText
					key={entry.collection.id}
					label={entry.collection.name}
					text={
						richTextToPlain(entry.collection.description) ||
						`Everything in ${entry.collection.name}, chosen with care.`
					}
					image={index % 2 === 0 ? EDITORIAL.media : EDITORIAL.feature}
					imagePosition={index % 2 === 0 ? "right" : "left"}
				/>
			))}
		</>
	);
}
