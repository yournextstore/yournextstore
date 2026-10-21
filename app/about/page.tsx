import type { Metadata } from "next";
import { cacheLife } from "next/cache";
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

	const values = [
		{
			title: "Hand-picked finds",
			text: "Every product earns its place: useful, well made and fairly priced. If we would not use it ourselves, it is not in the shop.",
			className: "bg-orange-200",
		},
		{
			title: "Prices you can trust",
			text: "No inflated list prices and no countdown timers. What you see is what you pay, and every discount is a real one.",
			className: "bg-blue-200",
		},
		{
			title: "Clear terms",
			text: "Shipping, delivery and return terms are written down on our policy pages, so you can read them before you order.",
			className: "bg-violet-200",
		},
	];

	return (
		<div className="px-6">
			<JsonLdScript data={aboutJsonLd} />
			<div className="mx-auto my-10 max-w-7xl">
				<div className="rounded-3xl bg-green-200 p-6 sm:p-16">
					<p className="inline-flex items-center gap-3 rounded-full bg-green-300 p-1 pr-4 text-xs text-green-800 sm:text-sm">
						<span className="rounded-full bg-go-green-ink px-3 py-1 text-xs text-white">ABOUT</span>
						The story behind {storeName}
					</p>
					<h1 className="my-3 max-w-xl bg-linear-to-r from-slate-600 to-[#5fd12b] bg-clip-text text-3xl font-medium leading-[1.2] text-transparent sm:text-5xl">
						Good things, simply sold.
					</h1>
					<p className="mt-4 max-w-2xl text-slate-700 sm:mt-8 sm:text-lg">
						{storeDescription ??
							`${storeName} started with a simple idea: shopping for everyday things should feel easy. We gather well-made pieces we love and sell them at honest prices.`}
					</p>
				</div>

				<div className="mt-20 flex flex-col items-center text-center">
					<h2 className="text-2xl font-semibold text-slate-800">What we care about</h2>
					<p className="mt-2 max-w-lg text-sm text-slate-600">Three ideas behind the shop.</p>
				</div>
				<div className="mt-12 grid gap-5 md:grid-cols-3">
					{values.map((value) => (
						<div key={value.title} className={`rounded-3xl p-8 ${value.className}`}>
							<h3 className="text-2xl font-medium text-slate-800">{value.title}</h3>
							<p className="mt-4 text-sm text-slate-700">{value.text}</p>
						</div>
					))}
				</div>

				<div className="my-24 flex flex-col items-center gap-6 text-center">
					<h2 className="text-2xl font-semibold text-slate-800">Ready to look around?</h2>
					<div className="flex flex-wrap justify-center gap-4">
						<Link
							href="/products"
							className="rounded-md bg-slate-800 px-10 py-3 text-sm text-white transition hover:bg-slate-900 active:scale-95"
						>
							SHOP NOW
						</Link>
						{contactFormEnabled && (
							<Link
								href="/contact"
								className="rounded-md bg-slate-100 px-10 py-3 text-sm text-slate-700 transition hover:bg-slate-200"
							>
								CONTACT US
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
