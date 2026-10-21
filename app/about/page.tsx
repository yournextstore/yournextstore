import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { HullMarquee } from "@/components/sections/hull-marquee";
import { editorial, getHomeData } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

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

	const { words: catalogWords } = await getHomeData();
	const left = editorial.aboutLeft;
	const right = editorial.aboutRight;
	// The strip needs a few words to run; top up a short catalogue with neutral ones.
	const words = [...catalogWords, "New in", "Vinyl", "Tapes"].slice(0, Math.max(6, catalogWords.length));

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<h1 className="sr-only">About {storeName}</h1>

			{/* The original opens on a running strip of label logos; ours runs what we stock. */}
			<HullMarquee duration={45} className="border-b border-border">
				{words.map((word) => (
					<span key={word} className="flex items-center p-8 text-h1 leading-none whitespace-nowrap">
						{word}
						<span aria-hidden className="ml-16 inline-block size-3 rounded-full border border-foreground" />
					</span>
				))}
			</HullMarquee>

			<section className="border-b border-border px-4 py-12 md:p-8 md:py-16 lg:py-20">
				<div className="mx-auto max-w-[600px]">
					<p className="mb-2 text-right text-body">Manifesto—</p>
					<p className="text-justify text-h2 leading-[1.25]">
						{storeDescription ??
							`${storeName} is a small independent label: we press the records, print the shirts and pack every order ourselves.`}
					</p>
				</div>
			</section>

			<section className="border-b border-border px-4 py-12 md:p-8 md:py-16 lg:py-20">
				<div className="grid items-center gap-8 md:grid-cols-3">
					<div className="relative aspect-square overflow-hidden bg-muted">
						{left && (
							<YNSMedia
								src={left}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover"
							/>
						)}
					</div>
					<div className="text-center">
						<p className="text-body">Find your favourite</p>
						<Link
							href="/products"
							className="mt-1 inline-block border-b border-current text-h3 transition-opacity hover:opacity-40"
						>
							Shop everything
						</Link>
						<hr className="my-10 border-t border-border" />
						<p className="text-body">Questions first</p>
						{contactFormEnabled ? (
							<Link
								href="/contact"
								className="mt-1 inline-block border-b border-current text-h3 transition-opacity hover:opacity-40"
							>
								Get in touch
							</Link>
						) : (
							<Link
								href="/faq"
								className="mt-1 inline-block border-b border-current text-h3 transition-opacity hover:opacity-40"
							>
								Read the FAQ
							</Link>
						)}
					</div>
					<div className="relative aspect-square overflow-hidden bg-muted">
						{right && (
							<YNSMedia
								src={right}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover"
							/>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
