import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_IMAGE } from "@/lib/editorial";
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

	const values = [
		{
			title: "Chosen with care",
			body: "Every piece earns its place for how it is used day to day, not only how it looks on a shelf.",
		},
		{
			title: "Clear choices",
			body: "Colours, sizes and options laid out plainly, so the right one is easy to find.",
		},
		{
			title: "Details up front",
			body: "Each product lists its options, price and stock before you add it to your bag.",
		},
	];

	return (
		<div className="min-h-svh">
			<JsonLdScript data={aboutJsonLd} />

			<section className="mb-5 flex items-center justify-between gap-10 py-1">
				<div className="w-full max-w-xl py-2 lg:w-1/2">
					<h1 className="py-3 text-display-xs font-semibold sm:text-display-sm">About us</h1>
					<p className="py-3 text-lg text-gray-600">
						{storeDescription ??
							`${storeName} gathers everyday frames, sunglasses and readers, picked with care.`}
					</p>
					<div className="flex flex-wrap items-center gap-3">
						<Link href="/products" className="btn-primary text-sm md:text-base">
							Start Shopping
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="btn-rounded-secondary text-sm md:text-base">
								Contact us
							</Link>
						)}
					</div>
				</div>
				<div className="hidden w-1/2 justify-end lg:flex">
					<div className="relative aspect-[350/317] w-2/3 overflow-hidden rounded-[1.75rem] bg-[radial-gradient(120%_90%_at_20%_15%,#fde68a_0%,#facc15_38%,#eab308_70%,#d99a06_100%)]">
						<YNSMedia
							src={ABOUT_IMAGE.src}
							alt=""
							fill
							sizes="24vw"
							className="object-cover"
							style={{ objectPosition: ABOUT_IMAGE.position }}
						/>
					</div>
				</div>
			</section>

			<section className="mt-10">
				<h2 className="text-center text-3xl md:text-4xl">What we care about</h2>
				<ul className="mt-6 grid gap-4 md:grid-cols-3">
					{values.map((value) => (
						<li key={value.title} className="rounded-xl bg-black/[0.06] p-6">
							<h3 className="text-xl font-bold">{value.title}</h3>
							<p className="mt-2 text-gray-600">{value.body}</p>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
