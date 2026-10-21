import { HeartHandshakeIcon, LeafIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Crumbs } from "@/components/crumbs";
import { TitlePanel } from "@/components/listing";
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
			storeDescription ?? "Learn about our story, our values, and the people behind the food we sell.",
	};

	const values = [
		{
			icon: LeafIcon,
			title: "Quality first",
			text: "Every product is chosen with care, and we only stock what we are proud to stand behind.",
		},
		{
			icon: SparklesIcon,
			title: "Thoughtful details",
			text: "From the first look to the last click, we want shopping here to feel simple and calm.",
		},
		{
			icon: HeartHandshakeIcon,
			title: "Honest service",
			text: "Clear prices, clear policies and straightforward answers to your questions.",
		},
	];

	return (
		<div className="fc-container">
			<JsonLdScript data={aboutJsonLd} />
			<Crumbs items={[{ href: "/", label: "Home" }, { label: "About Us" }]} />

			<div className="mt-8 mb-14">
				<TitlePanel title={`About ${storeName}`} text={storeDescription} />

				<section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
					<h2 className="text-fc-lg">Our Story</h2>
					<div className="space-y-4 text-fc-md leading-relaxed font-normal">
						<p>
							We started with a simple idea: the weekly grocery shop should feel good. Every product in our
							range is chosen for flavour and quality, from the fruit and vegetables to the pantry staples.
						</p>
						<p>
							We look for growers, bakers and makers who share our values: good ingredients, honest prices and
							food made to be cooked, shared and enjoyed.
						</p>
					</div>
				</section>

				<section className="mt-14">
					<h2 className="mb-6 text-fc-lg">What We Stand For</h2>
					<div className="grid gap-4 md:grid-cols-3">
						{values.map((value) => (
							<div key={value.title} className="fc-card gap-4 p-6">
								<value.icon className="size-10 text-green-500" strokeWidth={1.5} aria-hidden />
								<div className="flex flex-col gap-2">
									<h3 className="text-fc-md">{value.title}</h3>
									<p>{value.text}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="mt-14 rounded-lg bg-gray-100 p-8 text-center">
					<h2 className="text-fc-xl">Want to learn more?</h2>
					<p className="mt-2">Explore the shop or get in touch — we would love to hear from you.</p>
					<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
						<Link href="/products" className="fc-btn fc-btn-green">
							Shop products
						</Link>
						{contactFormEnabled ? (
							<Link href="/contact" className="fc-btn fc-btn-outline">
								Contact us
							</Link>
						) : (
							<Link href="/faq" className="fc-btn fc-btn-outline">
								Read the FAQ
							</Link>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
