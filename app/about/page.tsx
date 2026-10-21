import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/bakery/arrow";
import { SectionHeader } from "@/components/bakery/section-header";
import { Separator } from "@/components/bakery/separator";
import { getMenuCategories, getStoreBrand, LIFESTYLE } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { BODY_COPY, buttonClass } from "@/lib/ui";

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

	const [brand, categories] = await Promise.all([getStoreBrand(), getMenuCategories().catch(() => [])]);
	const storeName = brand.name;
	const storyImage = LIFESTYLE.aboutStory;
	const kitchenImage = LIFESTYLE.aboutHero;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: brand.description || "Our story, our values, and the people behind the shop.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<div className="bake-container pt-4 pb-16 lg:pt-0 lg:pb-24">
				<SectionHeader
					as="h1"
					title={`About ${storeName}`}
					subtitle="Where every crumb tells a little story"
					className="mx-auto max-w-3xl"
				/>
				<div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:items-center lg:gap-16">
					<div className="blob-shadow relative aspect-video overflow-hidden rounded-md lg:aspect-square lg:overflow-visible">
						{kitchenImage ? (
							<div className="blob-mask absolute inset-0">
								<Image
									src={kitchenImage.src}
									alt=""
									fill
									priority
									sizes="(max-width: 1024px) 100vw, 512px"
									className="object-cover"
								/>
							</div>
						) : null}
					</div>
					<div className="flex flex-col gap-4">
						<h2 className="font-serif text-heading-2xl font-bold lg:text-heading-3xl">Our Story</h2>
						<p className={BODY_COPY}>
							{storeName} began with a simple idea: that the best things are the ones you reach for every day.
							A bag that goes everywhere, a print that warms a wall, a favourite you keep coming back to.
						</p>
						<p className={BODY_COPY}>
							Everything in our shop is chosen to be enjoyed, whether that is with the people around you or by
							yourself on a quiet morning. We keep the list short, the descriptions honest and the choice
							generous.
						</p>
					</div>
				</div>
			</div>

			<Separator />
			<section className="bg-surface py-16 lg:py-24">
				<div className="bake-container flex flex-col gap-8 lg:gap-16">
					<SectionHeader
						title="What We Stand For"
						subtitle="Three things we never skip, whatever comes out of the oven"
					/>
					<ul className="grid gap-8 lg:grid-cols-3">
						{VALUES.map((value) => (
							<li
								key={value.title}
								className="space-y-3 rounded-md border border-line-soft bg-background p-6 shadow-soft lg:p-8"
							>
								<h3 className="font-serif text-heading-xl font-bold text-brand">{value.title}</h3>
								<p className={BODY_COPY}>{value.text}</p>
							</li>
						))}
					</ul>
				</div>
			</section>
			<Separator flip />

			<section className="bake-container flex flex-col gap-6 py-16 lg:flex-row-reverse lg:items-center lg:gap-16 lg:py-24">
				<div className="relative aspect-video flex-1 overflow-hidden rounded-md shadow-soft lg:aspect-[4/3]">
					{storyImage ? (
						<Image
							src={storyImage.src}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 576px"
							className="object-cover"
						/>
					) : null}
				</div>
				<div className="flex flex-1 flex-col gap-3 lg:gap-4">
					<h2 className="font-serif text-heading-2xl font-bold lg:text-heading-3xl xl:text-heading-4xl">
						Come Take a Look
					</h2>
					<p className={BODY_COPY}>
						{categories.length > 0
							? `Our shop is laid out in ${categories.length} ${categories.length === 1 ? "section" : "sections"}: ${categories.map((category) => category.name).join(", ")}. Take your time, and take something home.`
							: "Take your time with the shop, and take something home."}
					</p>
					<div className="mt-2 flex flex-col gap-3 sm:flex-row">
						<Link href="/products" className={buttonClass({ className: "sm:w-fit" })}>
							<span>See the shop</span>
							<Arrow />
						</Link>
						{brand.contact ? (
							<Link href="/contact" className={buttonClass({ variant: "secondary", className: "sm:w-fit" })}>
								<span>Contact us</span>
								<Arrow />
							</Link>
						) : null}
					</div>
				</div>
			</section>
		</>
	);
}

const VALUES = [
	{
		title: "Chosen with Care",
		text: "A short list of bakes we eat ourselves, made from flour, butter and honey we know by name.",
	},
	{
		title: "Made to Enjoy",
		text: "Little delights for busy mornings and slow weekends: everything here is meant to be shared and enjoyed.",
	},
	{
		title: "Described Honestly",
		text: "No shortcuts on the things that matter. Every product page shows its photos, options and current price.",
	},
];
