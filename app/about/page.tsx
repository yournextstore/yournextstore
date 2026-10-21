import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { PageTrail } from "@/components/listing-shell";
import { getCatalogStats, getStoreIdentity } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import aboutHoodie from "@/public/images/pexels/about-hoodie.jpg";
import aboutStudio from "@/public/images/pexels/about-studio.jpg";

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

const values = [
	{
		title: "Quality first",
		body: "Durable, well-made pieces we are proud to stand behind, photographed honestly so you know what arrives.",
	},
	{
		title: "Made for every day",
		body: "Considered details and good materials that hold up to everyday life, season after season.",
	},
	{
		title: "Honest service",
		body: "Real people behind the shop, happy to answer your questions about any piece.",
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [identity, stats] = await Promise.all([getStoreIdentity(), getCatalogStats()]);
	const { storeName, storeDescription, contactFormEnabled } = identity;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div className="frame pb-10">
			<JsonLdScript data={aboutJsonLd} />
			<PageTrail crumbs={[{ label: "About" }]} />

			<section className="grid grid-cols-1 gap-8 overflow-hidden rounded-[40px] bg-band px-6 pt-10 pb-6 md:grid-cols-2 md:p-[70px]">
				<div>
					<h1 className="font-display mb-5 text-[2.25rem] leading-[1.05] wrap-break-word lg:mb-8 lg:text-[3rem] xl:text-display-xl">
						About {storeName}
					</h1>
					<p className="mb-6 max-w-[545px] text-sm text-muted-foreground lg:mb-8 lg:text-base">
						{storeDescription ??
							"We believe in pieces you reach for every day. Everything in our shop is chosen for the quality of its making, the way it wears and the way it makes you feel."}
					</p>
					<dl className="flex flex-wrap gap-x-8 gap-y-4">
						{[
							{ value: stats.products, label: "Products" },
							{ value: stats.categories, label: "Categories" },
						].map((item) => (
							<div key={item.label} className="flex flex-col-reverse">
								<dt className="text-xs text-muted-foreground xl:text-base">{item.label}</dt>
								<dd className="text-2xl font-bold lg:text-[40px] lg:leading-tight">{item.value}</dd>
							</div>
						))}
					</dl>
				</div>
				<div className="grid min-h-[280px] grid-cols-2 gap-4">
					{[aboutHoodie, aboutStudio].map((photo, index) => (
						<div
							key={photo.src}
							className={`relative overflow-hidden rounded-[20px] bg-white ${index === 1 ? "mt-10" : "mb-10"}`}
						>
							<Image
								src={photo}
								alt=""
								fill
								placeholder="blur"
								sizes="(max-width: 768px) 50vw, 300px"
								className="object-cover"
							/>
						</div>
					))}
				</div>
			</section>

			<section className="my-[50px] sm:my-20">
				<h2 className="font-display mb-8 text-center text-display-sm md:mb-14 md:text-display-lg">
					What we stand for
				</h2>
				<ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
					{values.map((value) => (
						<li key={value.title} className="rounded-[20px] border border-black/10 p-6 sm:px-8 sm:py-7">
							<p className="mb-2 flex items-center gap-1 sm:mb-3">
								<strong className="sm:text-xl">{value.title}</strong>
								<CircleCheck className="size-5 fill-verified text-white sm:size-6" aria-hidden />
							</p>
							<p className="text-sm text-muted-foreground sm:text-base">{value.body}</p>
						</li>
					))}
				</ul>
			</section>

			<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
				<Link
					href="/products"
					className="inline-block w-full rounded-full bg-black px-14 py-4 text-center text-white transition-colors hover:bg-black/80 sm:w-auto"
				>
					Shop Now
				</Link>
				{contactFormEnabled && (
					<Link
						href="/contact"
						className="inline-block w-full rounded-full border border-black/10 px-14 py-4 text-center font-medium transition-colors hover:bg-black hover:text-white sm:w-auto"
					>
						Contact us
					</Link>
				)}
			</div>
		</div>
	);
}
