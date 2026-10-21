import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
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
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />

			<div className="mx-auto max-w-[1640px] px-4 pt-6 sm:px-5 sm:pt-8 lg:px-9">
				<nav aria-label="Breadcrumb" className="cap-xs text-faint">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<span aria-hidden> / </span>
					<span aria-current="page">About</span>
				</nav>
			</div>

			<section className="mx-auto flex max-w-[900px] flex-col items-center gap-6 px-5 py-16 text-center sm:gap-8 sm:py-24">
				<p className="text-[11px] tracking-[0.3em]">THE HOUSE</p>
				<h1 className="text-[clamp(26px,3vw,40px)] font-normal uppercase leading-tight tracking-[0.2em]">
					About {storeName}
				</h1>
				<p className="text-[clamp(17px,2vw,22px)] leading-relaxed tracking-[0.06em] text-pretty">
					{storeDescription ??
						"Made for people who choose slowly. We keep the pieces that hold up through long days and longer years — considered proportions, quiet design, nothing that shouts."}
				</p>
			</section>

			<section className="grid grid-cols-[minmax(0,1fr)] border-y border-line md:grid-cols-2">
				<div className="relative min-h-[360px] bg-stage md:min-h-[560px]">
					<Image
						src="/images/hero-3.jpg"
						alt=""
						fill
						sizes="(min-width: 768px) 50vw, 100vw"
						className="object-cover"
					/>
				</div>
				<div className="flex flex-col justify-center gap-10 px-6 py-16 lg:px-[72px]">
					<div className="flex flex-col gap-4">
						<h2 className="text-[15px] font-normal uppercase tracking-[0.26em]">Our story</h2>
						<p className="max-w-[52ch] text-[12px] leading-loose text-soft">
							Every piece in the collection is chosen for how it is used, not how loudly it arrives. We keep
							the edit small enough to stand behind everything in it, and describe each piece plainly.
						</p>
					</div>
					<ul className="grid gap-8 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
						{[
							["Chosen with care", "Pieces we would use ourselves, edited with intent."],
							["Described plainly", "Photos and details that show each piece as it is."],
							["Meant to be kept", "Quiet design that stays good-looking long after the season."],
						].map(([title, body]) => (
							<li key={title} className="flex flex-col gap-2">
								<h3 className="text-[10px] font-normal uppercase tracking-[0.2em]">{title}</h3>
								<p className="text-[12px] leading-loose text-soft">{body}</p>
							</li>
						))}
					</ul>
					<div className="flex flex-wrap gap-8">
						<Link href="/products" className="link-u text-[10px] uppercase tracking-[0.22em]">
							Shop the collection
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="link-u text-[10px] uppercase tracking-[0.22em]">
								Contact us
							</Link>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
