import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Crumbs } from "@/components/mandala/crumbs";
import { ListingHead } from "@/components/mandala/listing-head";
import { getStoreIdentity } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import aboutBag from "@/public/images/pexels/about-black-bag.jpg";
import aboutSneakers from "@/public/images/pexels/about-sneakers-purse.jpg";

const frames = [aboutSneakers, aboutBag];

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

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreIdentity();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	// The original has no about page; this one extends its home blocks: listing-style head, the
	// copy-and-picture split, then the hairline strip with the next step.
	return (
		<div className="shell pb-24">
			<JsonLdScript data={aboutJsonLd} />
			<Crumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
			<ListingHead title={`About ${storeName}`} />

			<section className="grid grid-cols-1 gap-y-12 pt-12 lg:grid-cols-12 lg:gap-x-12 lg:pt-16">
				<div className="lg:col-span-5">
					<h2 className="text-2xl font-bold leading-8 tracking-tight">Shoes chosen with care</h2>
					{storeDescription ? (
						<p className="mt-6 text-base leading-7 text-[#111827]">{storeDescription}</p>
					) : null}
					<div className="mt-6 space-y-5 text-[0.9375rem] leading-7 text-[#374151]">
						<p>
							Every pair in the shop is picked for how it fits, how it walks and how easily it goes with the
							clothes you already have. We would rather offer a short list we believe in than a long one we
							don&apos;t.
						</p>
						<p>
							Materials and making come first: we look for good leather, solid construction and soles that can
							be replaced, so a pair keeps going long after the season it arrived in.
						</p>
					</div>
					<dl className="mt-10 divide-y divide-border border-y border-border">
						{[
							["Quality first", "Well-made pairs in leather, suede and canvas."],
							["Thoughtful design", "Classic shapes that work with what you already wear."],
							["Real people", "A small team behind every order."],
						].map(([term, detail]) => (
							<div key={term} className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-6">
								<dt className="text-sm font-bold text-[#111827] sm:w-40 sm:shrink-0">{term}</dt>
								<dd className="text-sm text-[#374151]">{detail}</dd>
							</div>
						))}
					</dl>
				</div>
				<div className="grid grid-cols-2 gap-4 lg:col-span-7">
					{frames.map((frame, index) => (
						<div
							key={frame.src}
							className={`relative aspect-[2/3] overflow-hidden rounded-md bg-secondary ${index === 1 ? "mt-12" : ""}`}
						>
							<Image
								src={frame}
								alt=""
								fill
								placeholder="blur"
								sizes="(max-width: 1024px) 50vw, 360px"
								className="object-cover"
							/>
						</div>
					))}
				</div>
			</section>

			<section className="mt-20 border-y border-border py-12">
				<h2 className="text-2xl font-bold leading-8 tracking-tight">Want to see more?</h2>
				<p className="mt-6 text-base leading-7 text-[#111827]">
					Browse{" "}
					<Link href="/products" className="underline underline-offset-2 hover:text-indigo">
						everything in the shop
					</Link>
					{contactFormEnabled ? (
						<>
							{" "}
							or{" "}
							<Link href="/contact" className="underline underline-offset-2 hover:text-indigo">
								send us a message
							</Link>
						</>
					) : null}
					.
				</p>
			</section>
		</div>
	);
}
