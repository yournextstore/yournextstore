import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { EDITORIAL } from "@/lib/catalog";
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

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values and how we make our skin, body and hair care.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />

			{/* Split hero: statement left, portrait on Horizon's overlapping colour blocks right. */}
			<section className="mx-auto grid max-w-[120rem] grid-cols-1 items-center gap-10 overflow-hidden pt-10 md:grid-cols-2 md:gap-6 md:pt-0">
				<div className="px-6 md:pl-10 lg:pl-20">
					<h1 className="max-w-[30rem] text-title font-semibold text-ink lg:text-display">
						Good things,
						<br />
						chosen well
					</h1>
					<p className="mt-6 max-w-[34rem] text-lede text-ink">
						{storeDescription ??
							`Everyday things should be simple to find, good to use and fair to buy. That's the idea ${storeName} is built on.`}
					</p>
				</div>
				<div aria-hidden className="relative h-[24rem] md:h-[33rem] lg:h-[46rem]">
					<span className="absolute left-0 top-0 h-[44%] w-[47%] rounded-tl-[1.25rem] rounded-tr-[9rem] bg-peach" />
					<span className="absolute right-0 top-0 h-[63%] w-[58%] rounded-tl-[1.25rem] bg-mist" />
					<span className="absolute bottom-[34%] right-[2%] size-[26%] rounded-full bg-butter" />
					<span className="absolute bottom-0 left-[20%] h-[46%] w-[54%] rounded-t-[1.25rem] bg-[#f0dba7]" />
					<div className="absolute left-[16%] top-[18%] h-[57%] w-[69%] overflow-hidden rounded-image">
						<Image
							src={EDITORIAL.about}
							alt=""
							fill
							priority
							sizes="(max-width: 768px) 70vw, 35vw"
							className="object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Sand values band */}
			<section className="bg-sand">
				<div className="mx-auto max-w-[36rem] px-6 py-14 text-center">
					<p className="text-fine font-semibold text-ink">Our values</p>
					<h2 className="mt-3 text-[1.5rem] font-semibold leading-tight text-ink lg:text-[2rem]">
						Simple. Gentle. Honest.
					</h2>
					<p className="mt-4 text-[1.5rem] leading-snug text-ink lg:text-[1.75rem]">
						At {storeName}, we want shopping to feel easy: a short range of gentle products, clear ingredient
						lists and fair prices from the first click to checkout.
					</p>
				</div>
			</section>

			{/* Three line-drawn pillars */}
			<section className="mx-auto max-w-[72rem] px-6 py-16 text-center">
				<h2 className="text-[1.5rem] font-semibold text-ink lg:text-[2rem]">What we stand for</h2>
				<ul className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
					{PILLARS.map((pillar) => (
						<li key={pillar.title} className="flex flex-col items-center">
							<Image src={pillar.icon} alt="" width={144} height={144} className="size-28 lg:size-36" />
							<h3 className="mt-6 text-lede font-normal text-ink">{pillar.title}</h3>
							<p className="mt-3 max-w-[18rem] text-copy text-plum lg:text-base">{pillar.body}</p>
						</li>
					))}
				</ul>
				<Link href="/products" className="btn-line mt-12">
					Shop the range
				</Link>
			</section>

			{/* Closing band in the home page's statement style, with a way to reach the shop. */}
			<section className="bg-sand">
				<div className="shell flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
					<p className="max-w-[36rem] text-[1.5rem] leading-snug text-ink lg:text-title">
						Questions about a product? <strong className="font-semibold">We&rsquo;re here to help.</strong>
					</p>
					<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn-ink shrink-0">
						{contactFormEnabled ? "Contact us" : "Read the FAQ"}
					</Link>
				</div>
			</section>
		</>
	);
}

const PILLARS = [
	{
		icon: "/images/icon-curated.svg",
		title: "Curated products",
		body: "A short range, so every product in it has a clear reason to be on your shelf.",
	},
	{
		icon: "/images/icon-tested.svg",
		title: "Thoughtfully made",
		body: "Made for how they feel on skin day after day, not for the length of an ingredient list.",
	},
	{
		icon: "/images/icon-plant.svg",
		title: "Inspired by nature",
		body: "Plant oils, butters and clays behind most of what we make.",
	},
] as const;
