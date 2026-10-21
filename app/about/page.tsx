import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { CtaBand } from "@/components/garden/cta-band";
import { IconPottedTree, IconSeedling, IconSupport } from "@/components/garden/icons";
import { PageHead } from "@/components/garden/listing";
import { getStoreSeo } from "@/lib/commerce";
import { EDITORIAL, getStoreBrand } from "@/lib/garden";
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
	const brand = await getStoreBrand();
	return { storeName: brand.name, storeDescription: brand.description, photo: EDITORIAL.story };
}

const VALUES = [
	{
		icon: IconSupport,
		title: "Fewer, better things",
		text: "We would rather grow a short list of trees well than a long one badly. Everything here earns its place on the bench.",
	},
	{
		icon: IconSeedling,
		title: "Suited to your life",
		text: "The right tree is one that suits your light and your time. We will happily point you to a forgiving one.",
	},
	{
		icon: IconPottedTree,
		title: "Easy to ask",
		text: "Wondering about size, materials or how something wears? Read the FAQ or send us a note before you buy.",
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, photo } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<PageHead
				crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
				title="Chosen slowly, by people who notice."
				lede={
					storeDescription ?? `${storeName} is a small shop for the few good things we keep close, every day.`
				}
				note={
					<>
						Good things
						<br />
						grow slowly.
					</>
				}
			/>

			<section className="section pt-4">
				<div className="wrap story-lead">
					<div className="photo relative">
						{photo && (
							<YNSMedia
								src={photo}
								alt=""
								fill
								sizes="(max-width: 1080px) 100vw, 55vw"
								className="object-cover"
							/>
						)}
					</div>
					<div className="story-lead__text">
						<p className="eyebrow">Our story</p>
						<h2 className="h2">More Than Trees, It&apos;s a Slow Craft.</h2>
						<p>
							{storeName} started on a single potting bench, with a few junipers and a lot of patience. We
							grow, trim and pot every tree ourselves, and sell only the pots and tools we use.
						</p>
						<p>
							Friends asked for cuttings, then for trees, then for the scissors we used. Then their friends
							did. Before long, a small nursery shop was the only sensible answer.
						</p>
						<p className="story-lead__sign">— the {storeName} team</p>
					</div>
				</div>
			</section>

			<section className="section bg-[var(--paper-2)]" aria-label="What we stand for">
				<div className="wrap values">
					{VALUES.map(({ icon: Icon, title, text }) => (
						<div className="value" key={title}>
							<Icon width={36} height={36} />
							<h3>{title}</h3>
							<p>{text}</p>
						</div>
					))}
				</div>
			</section>

			<section className="section bg-[var(--cream)]">
				<div className="wrap max-w-[60rem]">
					<figure className="quote-block">
						<blockquote>
							We are not selling things. We are looking for the few that make an ordinary day feel a little
							better.
						</blockquote>
					</figure>
				</div>
			</section>

			<CtaBand />
		</>
	);
}
