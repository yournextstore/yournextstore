import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterBand, SectionHeader, StoryBand } from "@/components/sections/home";
import { getEditorialImages, pick } from "@/lib/catalog";
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

const VALUES = [
	{
		title: "Seasonal first",
		copy: "We start with what is growing now, so the flowers look and smell their best.",
	},
	{
		title: "Tied by hand",
		copy: "Each bouquet is arranged and wrapped by hand, with the colours chosen for the moment.",
	},
	{
		title: "A short list",
		copy: "A few bouquets, plants and vases rather than an endless catalogue, so every stem earns its place.",
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [{ storeName, storeDescription, contactFormEnabled }, images] = await Promise.all([
		getStoreInfo(),
		getEditorialImages(),
	]);
	const image = pick(images, 2);

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
			<section className="mx-auto grid max-w-[1280px] items-center gap-8 bg-[linear-gradient(90deg,#edf2e7_0%,#f1eae3_100%)] px-[22px] pb-[34px] pt-10 md:min-h-[540px] md:grid-cols-[1fr_1.1fr] md:px-12 md:py-14">
				<div className="max-w-[520px] md:pl-8">
					<p className="eyebrow mb-5">Our story</p>
					<h1 className="type-display text-[3.2rem] sm:text-[clamp(3.6rem,6vw,5.6rem)]">
						A little more
						<br />
						<i>lovely.</i>
					</h1>
					<p className="mt-[26px] max-w-[400px] text-[1.03rem] leading-[1.7] text-muted-foreground">
						{storeDescription ??
							`${storeName} began with a simple idea: the things we give, and the things we keep, should feel as thoughtful as the moments they mark.`}
					</p>
				</div>
				<div className="relative h-[360px] md:h-[440px]">
					<div className="relative h-full overflow-hidden rounded-tile bg-cream shadow-photo">
						{image && (
							<YNSMedia
								src={image}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 600px"
								className="object-cover"
								priority
							/>
						)}
					</div>
					<div
						aria-hidden="true"
						className="serif absolute -right-2 top-[18px] flex size-[120px] -rotate-[8deg] items-center justify-center rounded-full bg-coral-deep text-center text-[0.92rem] italic leading-[1.1] text-white md:-right-[26px]"
					>
						chosen
						<br />
						with
						<br />
						love
					</div>
				</div>
			</section>

			<section aria-labelledby="values-title" className="container-x py-[100px]">
				<SectionHeader
					eyebrow="What we care about"
					title={
						<span id="values-title">
							Made with <i>care.</i>
						</span>
					}
					copy="Three small ideas behind every bouquet we tie."
				/>
				<ol className="mt-12 grid border-y border-line md:grid-cols-3">
					{VALUES.map((value, index) => (
						<li
							key={value.title}
							className="flex gap-5 border-line py-8 not-last:border-b md:px-8 md:not-last:border-b-0 md:not-last:border-r md:first:pl-0"
						>
							<span
								aria-hidden="true"
								className="serif text-[2.2rem] font-semibold leading-none text-coral-text"
							>
								{String(index + 1).padStart(2, "0")}
							</span>
							<div>
								<h3 className="serif text-[1.6rem] font-semibold leading-tight tracking-[-0.04em]">
									{value.title}
								</h3>
								<p className="mt-2 text-[0.85rem] leading-[1.8] text-muted-foreground">{value.copy}</p>
							</div>
						</li>
					))}
				</ol>
				<div className="mt-12 flex flex-wrap items-center gap-6">
					<Link href="/products" className="btn-pill">
						Shop the collection <span aria-hidden="true">↗</span>
					</Link>
					<Link href={contactFormEnabled ? "/contact" : "/faq"} className="link-underline">
						{contactFormEnabled ? "Say hello" : "Read the questions"} <span aria-hidden="true">→</span>
					</Link>
				</div>
			</section>

			<StoryBand cta={false} />
			<NewsletterBand />
		</div>
	);
}
