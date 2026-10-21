import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { PageBar } from "@/components/gf/page-bar";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { gfGreenPill, gfGreyPill } from "@/lib/gf-styles";
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
		{ title: "Picked with care", text: "A short, considered shelf instead of an endless aisle." },
		{ title: "Simple to order", text: "Browse, tap the green button, check out. That is the whole flow." },
		{ title: "Clear details", text: "Options, prices and stock are shown on every product before you buy." },
	];

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<PageBar title="About" />

			<section className="relative mt-[22px] overflow-hidden rounded-[30px] bg-green-500 p-5 pb-8 text-white">
				<div
					aria-hidden="true"
					className="absolute -top-[25px] -right-[25px] size-[100px] rounded-full bg-white/15"
				/>
				<div
					aria-hidden="true"
					className="absolute -top-[45px] right-[25px] size-[100px] rounded-full bg-white/15"
				/>
				<h2 className="relative max-w-[80%] text-gf-h3 font-bold">Welcome to {storeName}</h2>
				{storeDescription && <p className="relative mt-2.5 max-w-[85%] text-gf-h6">{storeDescription}</p>}
			</section>

			<section className="mt-[30px]">
				<h2 className="text-gf-h4 font-bold">What we stand for</h2>
				<ul className="mt-[18px] grid gap-3 sm:grid-cols-3">
					{values.map((value) => (
						<li key={value.title} className="rounded-[30px] bg-white p-5 gf-shadow">
							<h3 className="text-gf-h5 font-bold">{value.title}</h3>
							<p className="mt-2 text-gf-h6 text-muted-foreground">{value.text}</p>
						</li>
					))}
				</ul>
			</section>

			<section className="mt-[30px] rounded-[30px] bg-flash-white p-6 text-center">
				<h2 className="text-gf-h4 font-bold">Looking for more?</h2>
				<p className="mt-2 text-gf-h6 text-muted-foreground">The whole catalogue is one tap away.</p>
				<div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
					<Link href="/products" className={cn(gfGreenPill, "h-[50px] sm:w-auto")}>
						Shop products
					</Link>
					{contactFormEnabled && (
						<Link href="/contact" className={cn(gfGreyPill, "h-[50px] bg-white sm:w-auto")}>
							Contact us
						</Link>
					)}
				</div>
			</section>
		</div>
	);
}
