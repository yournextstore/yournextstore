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
		description: storeDescription ?? "Learn about our shop, the plants we grow and how we look after them.",
	};

	const values = [
		{ title: "Healthy plants", text: "Plants we have looked after ourselves before they go on sale." },
		{
			title: "Honest care notes",
			text: "Plain advice on light, water and size, so you can pick the right plant.",
		},
		{ title: "Real help", text: "Ask us about a yellow leaf or a tricky corner and we will answer." },
	];

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section className="container-soul flex flex-col gap-x-16 gap-y-10 py-10 sm:py-14 lg:flex-row lg:py-20">
				<div className="min-w-0 lg:w-1/3">
					<div className="sticky top-24">
						<nav aria-label="Breadcrumb" className="mb-6 text-sm">
							<Link href="/" className="font-medium text-contrast-500 hover:text-foreground">
								Home
							</Link>
							<span aria-hidden="true" className="mx-2 text-contrast-400">
								/
							</span>
							<span aria-current="page" className="font-medium">
								About us
							</span>
						</nav>
						<h1 className="mb-3 text-4xl leading-none lg:text-5xl">About {storeName}</h1>
						<p className="mb-8 max-w-xl text-lg leading-normal text-contrast-500">
							{storeDescription ??
								"We are a small houseplant shop. Every plant, pot and tool we stock is one we would keep at home."}
						</p>
						<Link href="/products" className="btn-soul btn-secondary min-h-14 px-6 py-4 text-base">
							Shop All
						</Link>
					</div>
				</div>
				<div className="min-w-0 space-y-12 lg:w-2/3">
					<div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-contrast-100">
						<Image
							src="/images/pexels/about-vase.jpg"
							alt="Shelves of potted plants and a stone counter with a brass watering can in a bright plant shop."
							fill
							sizes="(min-width: 64rem) 60vw, 100vw"
							className="object-cover"
							preload
						/>
					</div>
					<div>
						<h2 className="mb-4 text-2xl leading-none sm:text-3xl lg:text-4xl">Our story</h2>
						<div className="max-w-2xl space-y-4 text-lg leading-relaxed">
							<p>
								We started with a few plants on a windowsill and too many questions about why they drooped.
								Most of what we learned since comes down to the right plant in the right light.
							</p>
							<p>
								So we keep the range small: plants that suit real homes, planters that drain well, and care
								notes written plainly so you know what each plant needs.
							</p>
						</div>
					</div>
					<div>
						<h2 className="mb-6 text-2xl leading-none sm:text-3xl lg:text-4xl">What we stand for</h2>
						<dl className="grid gap-x-5 gap-y-8 sm:grid-cols-3">
							{values.map((value) => (
								<div key={value.title} className="rounded-2xl bg-contrast-100 p-6">
									<dt className="font-heading text-2xl leading-none">{value.title}</dt>
									<dd className="mt-3 text-contrast-500">{value.text}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>
			<section className="bg-lime-shadow">
				<div className="container-soul flex flex-col items-start gap-8 py-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:py-20">
					<div>
						<h2 className="mb-4 text-2xl leading-none text-lime-highlight sm:text-3xl lg:text-4xl">
							Want to learn more?
						</h2>
						<p className="text-lime-highlight/75">
							Explore our products or get in touch — we would love to hear from you.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Link href="/products" className="btn-soul btn-primary min-h-14 px-6 py-4 text-base">
							Shop now
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="btn-soul btn-tertiary min-h-14 px-6 py-4 text-base">
								Contact us
							</Link>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
