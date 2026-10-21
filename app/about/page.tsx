import { HandHeart, Leaf, Sprout } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Crumbs } from "@/components/crumbs";
import { EDITORIAL } from "@/lib/catalog";
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
		icon: Leaf,
		title: "Organic cotton",
		copy: "Soft organic cotton jersey, rib, muslin and knit that feels gentle against new skin.",
	},
	{
		icon: Sprout,
		title: "Made for real days",
		copy: "Envelope necks, poppers and two-way zips for quick changes, day and night.",
	},
	{
		icon: HandHeart,
		title: "Chosen with care",
		copy: "A small range in calm colours that mix and match, and a FAQ that answers the questions parents ask most.",
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();
	const image = EDITORIAL.about;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div className="container-x pb-16 pt-8">
			<JsonLdScript data={aboutJsonLd} />
			<Crumbs className="mb-8" items={[{ label: "Home", href: "/" }, { label: "Our story" }]} />

			<div className="grid items-stretch gap-6 rounded-[18px] bg-card p-5 shadow-card md:grid-cols-2 md:p-9">
				<div className="relative min-h-[320px] overflow-hidden rounded-form bg-muted md:min-h-[440px]">
					{image && (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 560px"
							className="object-cover"
							priority
						/>
					)}
				</div>
				<div className="flex flex-col justify-center">
					<p className="eyebrow mb-2">Our story</p>
					<h1 className="font-heading text-3xl text-ink md:text-5xl md:leading-tight">
						Soft clothes for little ones
					</h1>
					<p className="mt-4 text-muted-foreground">
						{storeDescription ??
							`${storeName} began with a simple idea: the first clothes a baby wears should be the softest and simplest.`}
					</p>
					<p className="mt-3 text-muted-foreground">
						We make bodysuits, sleepsuits, knits and swaddles in organic cotton and quiet colours — and we
						keep the range small, so every piece is one you will reach for at every change.
					</p>
					<Link
						href="/products"
						className="mt-7 inline-flex items-center justify-center self-start rounded-form bg-primary px-6 py-3 text-[13px] font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
					>
						Shop the collection
					</Link>
				</div>
			</div>

			<section aria-labelledby="values-title" className="py-16">
				<div className="mb-9 text-center">
					<p className="eyebrow mb-2">What we stand for</p>
					<h2 id="values-title" className="font-heading text-3xl font-semibold text-ink md:text-[2.4rem]">
						Made with care, chosen with love
					</h2>
				</div>
				<ul className="grid gap-10 sm:grid-cols-3">
					{VALUES.map((value) => (
						<li key={value.title} className="flex flex-col items-center text-center">
							<span className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
								<value.icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
							</span>
							<h3 className="font-heading text-xl text-ink">{value.title}</h3>
							<p className="mt-2 max-w-xs text-sm text-muted-foreground">{value.copy}</p>
						</li>
					))}
				</ul>
			</section>

			<div className="rounded-[18px] bg-footerbg px-6 py-12 text-center">
				<h2 className="font-heading text-3xl text-ink">Questions about a piece?</h2>
				<p className="mx-auto mt-3 max-w-md text-muted-foreground">
					Browse the shop, or read the answers to the questions we hear most.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/products"
						className="inline-flex h-11 items-center justify-center rounded-form bg-primary px-6 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
					>
						Visit the shop
					</Link>
					<Link
						href={contactFormEnabled ? "/contact" : "/faq"}
						className="inline-flex h-11 items-center justify-center rounded-form border border-input bg-surface px-6 text-[13px] font-semibold text-ink transition-colors hover:border-primary hover:text-pine"
					>
						{contactFormEnabled ? "Say hello" : "Read the FAQ"}
					</Link>
				</div>
			</div>
		</div>
	);
}
