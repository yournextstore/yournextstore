import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";
import { EDITORIAL, getStoreIdentity } from "@/lib/theme";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName}: our story, our values, and the people behind the linen.`;

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
		title: "Considered choices",
		body: "We work with linen and wool, chosen for the fibre, the weave and how they feel.",
	},
	{
		title: "Timeless design",
		body: "Plain hems, quiet colours and simple shapes that sit easily in any room.",
	},
	{
		title: "Made for real life",
		body: "Bedding, towels and table linen to use every day, not save for guests.",
	},
];

/** The original's about page: a photo band with the centred title, then one white card on greige. */
export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const identity = await getStoreIdentity();
	const hero = EDITORIAL.aboutHero;
	const story = EDITORIAL.aboutStory;

	return (
		<>
			<section className="relative flex h-72 items-center justify-center overflow-hidden bg-ink md:h-[18rem]">
				<YNSMedia src={hero.src} alt="" fill priority sizes="100vw" className="object-cover" />
				<div className="absolute inset-0 bg-black/35" />
				<h1 className="relative text-h4 text-white">About us</h1>
			</section>

			<section className="bg-[#eeece8] px-5 py-8 md:py-16">
				<div className="mx-auto max-w-[53rem] overflow-hidden rounded-lg bg-white">
					<div className="relative aspect-[3/1]">
						<YNSMedia
							src={story.src}
							alt=""
							fill
							sizes="(min-width: 860px) 848px, 100vw"
							className="object-cover"
						/>
					</div>
					<div className="px-6 py-10 md:px-20">
						<h2 className="text-[1.875rem] text-muted-foreground">{identity.name}</h2>
						<div className="mt-4 space-y-4 text-[13px] leading-relaxed text-muted-foreground">
							<p>
								{identity.description ??
									`It all began with a simple belief: that the linen you sleep in, dry off with and eat at should be a quiet pleasure.`}
							</p>
							<p>
								What started as a few lengths of washed linen grew into {identity.name}: bedding, bath and
								table linen chosen for good fibre, quiet colour and the way it softens with use.
							</p>
							<p>We make a small range and keep it simple: linen you will reach for every day.</p>
						</div>
					</div>
					<div id="contact" className="scroll-mt-28 border-t border-border px-6 py-10 md:px-20">
						<h2 className="font-serif text-xl">What we care about</h2>
						<ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
							{values.map((value) => (
								<li key={value.title}>
									<span className="font-semibold text-foreground">{value.title}:</span> {value.body}
								</li>
							))}
						</ul>
						<h2 className="mt-8 font-serif text-xl">Get in touch</h2>
						<p className="mt-2 text-[13px] text-muted-foreground">
							Questions about a product, an order or trade enquiries? We are happy to help.
						</p>
						<div className="mt-5 flex flex-wrap gap-3">
							{identity.contactEnabled && (
								<Link href="/contact" className="btn btn-primary btn-sm">
									Contact us
								</Link>
							)}
							<Link href="/faq" className="btn btn-outline btn-sm">
								Read the FAQ
							</Link>
							<a href="/account" className="btn btn-outline btn-sm">
								Your orders
							</a>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
