import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { EllipseLink } from "@/components/ellipse-link";
import { StorySection, Values } from "@/components/sections/home";
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

	const heroImage = "/images/pexels/about-windowsill.jpg";
	const storyImage = "/images/pexels/about-lavender.jpg";

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />

			<section className="container-page pt-6 md:pt-8">
				<div className="grid overflow-hidden rounded-xl bg-blush md:grid-cols-2">
					<div className="flex flex-col justify-center px-6 py-12 md:px-12 md:py-16">
						<p className="text-sm uppercase tracking-[0.12em] text-blush-foreground">Our story</p>
						<h1 className="mt-3 text-display text-foreground">About {storeName}</h1>
						<p className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground">
							{storeDescription ??
								"A small bath and body studio: soaks, soaps, oils and butters made from plants, in small batches."}
						</p>
					</div>
					{heroImage && (
						<div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
							<YNSMedia
								src={heroImage}
								alt=""
								fill
								priority
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
					)}
				</div>
			</section>

			<section aria-labelledby="believe-heading" className="bg-card py-16 md:py-24">
				<div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
					<div className="text-center md:px-8">
						<h2 id="believe-heading" className="text-title-xl text-foreground">
							What we believe
						</h2>
						<div className="mx-auto mt-5 max-w-lg space-y-4 text-[15px] leading-relaxed text-foreground">
							<p>
								Shopping should feel like a pause, not a project. We keep our range small and our descriptions
								honest, so choosing is simple.
							</p>
							<p>
								Every blend starts with plant ingredients we can name and stand behind, then earns its place
								by how often you reach for it.
							</p>
						</div>
						<EllipseLink href="/products" className="mt-6 text-foreground">
							Shop now
						</EllipseLink>
					</div>
					{storyImage && (
						<div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-subtle-2">
							<YNSMedia
								src={storyImage}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
					)}
				</div>
			</section>

			<StorySection />
			<Values />

			<section className="bg-card py-14 text-center md:py-20">
				<div className="container-page">
					<h2 className="text-title-lg text-foreground">Questions about an order?</h2>
					<p className="mx-auto mt-3 max-w-md text-[15px] text-foreground">
						Our help centre covers shipping, returns and payments.
					</p>
					<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Link
							href="/faq"
							className="inline-flex h-12 items-center rounded-md bg-primary px-8 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Visit help centre
						</Link>
						{contactFormEnabled && (
							<Link
								href="/contact"
								className="inline-flex h-12 items-center rounded-md border border-foreground/70 px-8 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary"
							>
								Contact us
							</Link>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
