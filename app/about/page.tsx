import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import storyImage from "@/public/images/story-3.jpg";

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

	const values = [
		{ title: "Picked by hand", body: "Every piece is checked seam by seam before it goes on the rail." },
		{
			title: "Wear shown, not hidden",
			body: "Measured sizes, honest photos and descriptions that name every fade, mark and repair.",
		},
		{ title: "People who answer", body: "Real people, ready to help before and after your order." },
	];

	return (
		<div className="page-x py-4 lg:py-8">
			<JsonLdScript data={aboutJsonLd} />

			<nav aria-label="Breadcrumb" className="mb-2 text-label-sm">
				<Link href="/" className="hover:underline">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span>About us</span>
			</nav>
			<h1 className="text-display font-medium uppercase md:text-[3.5rem] md:leading-[4rem]">About us</h1>

			<section className="mt-8 grid grid-cols-1 lg:grid-cols-2">
				<div className="flex flex-col justify-end rounded-sm border border-border p-6 lg:p-8">
					<h2 className="mb-6 text-title font-bold uppercase leading-tight md:text-[2.5rem] md:leading-[3rem]">
						The story of {storeName}
					</h2>
					<div className="max-w-xl space-y-4 text-label-lg font-light">
						{storeDescription && <p>{storeDescription}</p>}
						<p>
							We started with a simple idea: good clothes should be easy to find, easy to wear and made to
							last longer than a season.
						</p>
						<p>
							So we keep the range tight, we photograph what we sell honestly, and we only stock the pieces we
							would happily wear ourselves.
						</p>
					</div>
				</div>
				<Image
					src={storyImage}
					alt=""
					sizes="(min-width: 1024px) 50vw, 100vw"
					className="h-auto w-full rounded-sm object-cover"
				/>
			</section>

			<section className="mt-12">
				<h2 className="mb-6 text-heading font-medium uppercase md:text-title">What we stand for</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3">
					{values.map((value) => (
						<div key={value.title} className="rounded-sm border border-border p-6">
							<h3 className="mb-3 text-label-lg font-medium uppercase">{value.title}</h3>
							<p className="text-label font-light">{value.body}</p>
						</div>
					))}
				</div>
			</section>

			<section className="mt-12 flex h-[72px] font-bold uppercase lg:h-[144px]">
				<Link
					href="/products"
					className="group flex h-full flex-1 items-end justify-between rounded-sm border border-border p-6 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
				>
					<span>
						<span className="hidden group-hover:inline">#</span>Shop now
					</span>
					<ArrowRightIcon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
				</Link>
				{contactFormEnabled && (
					<Link
						href="/contact"
						className="group flex h-full flex-1 items-end justify-between rounded-sm border border-border p-6 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
					>
						<span>
							<span className="hidden group-hover:inline">#</span>Contact us
						</span>
						<ArrowRightIcon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
					</Link>
				)}
			</section>
		</div>
	);
}
