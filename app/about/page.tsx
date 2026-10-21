import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { EDITORIAL } from "@/lib/editorial";
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
			storeName: me.store.settings?.storeName || me.store.name || "our store",
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

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />

			<section className="relative flex h-[26rem] items-end overflow-hidden bg-ink text-white md:h-[32rem]">
				<YNSMedia src={EDITORIAL.aboutHero.src} alt="" fill priority sizes="100vw" className="object-cover" />
				<div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-black/15" />
				<div className="page-x relative pb-12 lg:pb-16">
					<p className="text-body-sm">About us</p>
					<h1 className="mt-3 text-display">The story behind {storeName}</h1>
					{storeDescription && (
						<p className="mt-4 max-w-2xl text-body-sm text-white/90 line-clamp-3">{storeDescription}</p>
					)}
				</div>
			</section>

			<section className="page-x grid items-center gap-10 py-16 md:grid-cols-2 lg:gap-16 lg:py-24">
				<div className="relative aspect-4/5 overflow-hidden rounded-md bg-secondary">
					<YNSMedia
						src={EDITORIAL.aboutStory.src}
						alt={EDITORIAL.aboutStory.alt}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<div className="max-w-xl">
					<h2 className="text-heading-lg">Our story</h2>
					<div className="mt-6 space-y-4 text-body leading-relaxed">
						<p>
							We believe a small wardrobe of good clothes beats a full one. Every piece in our collection is
							chosen to layer with the rest, in colours that work together and cloth that wears in well.
						</p>
						<p>
							We work with makers who share that view: those who put lasting materials, careful construction
							and timeless cuts ahead of fleeting trends.
						</p>
					</div>
					<Link
						href="/products"
						className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-6 text-body-sm text-primary-foreground transition-colors hover:bg-primary/85"
					>
						Shop the collection
					</Link>
				</div>
			</section>

			<section aria-label="What we stand for" className="bg-band">
				<div className="page-x py-16 lg:py-20">
					<h2 className="text-center text-heading-lg">What we stand for</h2>
					<ul className="mt-12 grid gap-10 text-center md:grid-cols-3">
						{[
							{ title: "Quality first", body: "Durable, well-made pieces we are proud to stand behind." },
							{ title: "Thoughtful design", body: "Considered details that make everyday moments better." },
							{
								title: "Made to layer",
								body: "Pieces that work together, so a few good things go a long way.",
							},
						].map((value) => (
							<li key={value.title}>
								<h3 className="text-heading-sm">{value.title}</h3>
								<p className="mx-auto mt-3 max-w-xs text-body-sm">{value.body}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="page-x py-16 text-center lg:py-20">
				<h2 className="text-heading-lg uppercase">Want to learn more?</h2>
				<p className="mx-auto mt-4 max-w-xl text-body-sm">
					Explore the collection or get in touch. We would love to hear from you.
				</p>
				<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<Link
						href="/products"
						className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-body-sm text-primary-foreground transition-colors hover:bg-primary/85"
					>
						Shop products
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="inline-flex h-11 items-center justify-center rounded-md border border-line px-6 text-body-sm transition-colors hover:bg-secondary"
						>
							Contact us
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
