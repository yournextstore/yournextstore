import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_IMAGE } from "@/lib/editorial";
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
			title: "Chosen with care",
			body: "A short, considered range rather than an endless one: each piece earns its place.",
		},
		{ title: "Made to be used", body: "Things that look good on the shelf and work just as well every day." },
		{
			title: "Here to help",
			body: "Questions before or after an order? Get in touch and we will gladly help.",
		},
	];

	return (
		<div className="layout pt-6 pb-24">
			<JsonLdScript data={aboutJsonLd} />

			<nav aria-label="Breadcrumb" className="mb-6 text-sm">
				<Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span>About</span>
			</nav>

			<section className="mb-16 grid overflow-hidden rounded-lg bg-pastel-2 lg:mb-20 lg:h-[450px] lg:grid-cols-12">
				<div className="flex items-center px-6 py-12 sm:px-10 lg:col-span-7 lg:pl-20">
					<div>
						<h1 className="mb-4 font-display text-[2.5rem] leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
							About {storeName}
						</h1>
						<p className="mb-8 max-w-md text-primary">
							{storeDescription ?? "A small shop with a simple idea: fewer, better things for everyday life."}
						</p>
						<Link
							href="/products"
							className="shimmer inline-flex h-11 w-max items-center gap-2 rounded-full bg-primary px-8 font-display text-lg font-light text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Shop products
							<ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
						</Link>
					</div>
				</div>
				<div className="relative min-h-64 sm:min-h-80 lg:col-span-5 lg:min-h-0">
					<Image
						src={ABOUT_IMAGE}
						alt=""
						fill
						sizes="(max-width: 1024px) 100vw, 40vw"
						className="object-cover"
					/>
				</div>
			</section>

			<section className="mb-16 grid gap-6 lg:mb-20 lg:grid-cols-12 lg:gap-10">
				<h2 className="text-2xl font-medium lg:col-span-4">Our story</h2>
				<div className="space-y-4 leading-relaxed text-primary lg:col-span-7">
					<p>
						We started {storeName} because we wanted a shop we would enjoy browsing ourselves: clear, calm and
						easy to find your way around, with every product shown as it really is.
					</p>
					<p>
						We keep the range focused, so every product is worth a closer look and easy to compare with the
						rest.
					</p>
				</div>
			</section>

			<section aria-labelledby="about-values" className="mb-16 lg:mb-20">
				<h2 id="about-values" className="mb-6 text-2xl font-medium">
					What we stand for
				</h2>
				<ul className="grid gap-4 md:grid-cols-3">
					{values.map((value) => (
						<li key={value.title} className="rounded-lg bg-secondary p-6 lg:p-8">
							<h3 className="mb-2 font-display text-2xl">{value.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{value.body}</p>
						</li>
					))}
				</ul>
			</section>

			<section className="flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-medium">Want to learn more?</h2>
					<p className="mt-2 text-muted-foreground">
						Browse the shop, or get in touch: we would love to hear from you.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Link
						href="/products"
						className="shimmer inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Shop products
					</Link>
					{contactFormEnabled ? (
						<Link
							href="/contact"
							className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
						>
							Contact us
						</Link>
					) : (
						<Link
							href="/faq"
							className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
						>
							Read the FAQ
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
