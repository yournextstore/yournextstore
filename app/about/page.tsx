import { AwardIcon, LeafIcon, ShoppingBagIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { GetInspired } from "@/components/sections/get-inspired";
import { editorialImages, getStoreName } from "@/lib/catalog";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";
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
	const [me, storeName] = await Promise.all([meGetCached().catch(() => null), getStoreName()]);
	return {
		storeName,
		storeDescription: me?.store.settings?.storeDescription || null,
		contactFormEnabled: me?.store.settings?.enabledTools?.contactForm ?? false,
	};
}

async function getCatalogFacts() {
	"use cache";
	cacheLife("hours");
	const [products, categories, collections] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => null),
		commerce.collectionBrowse({ limit: 100 }).catch(() => null),
	]);
	return [
		{ value: `${products?.meta.count ?? 0}`, label: "pieces in the catalogue" },
		{ value: `${categories?.data.filter((c) => !c.parentId).length ?? 0}`, label: "categories" },
		{
			value: `${collections?.data.filter((c) => c.active && (c.productCollections.length > 0 || (c.metafieldRules?.length ?? 0) > 0)).length ?? 0}`,
			label: "curated collections",
		},
		{ value: "24/7", label: "open online" },
	];
}

const values = [
	{
		icon: AwardIcon,
		title: "Exceptional quality",
		text: "Solid ash frames, honed travertine and dense boucle and linen, chosen to look good after years of daily use.",
	},
	{
		icon: ShoppingBagIcon,
		title: "Timeless design",
		text: "Low, simple shapes that sit quietly with what you already own, not just this season's trends.",
	},
	{
		icon: LeafIcon,
		title: "Responsible choices",
		text: "Removable covers and solid wood construction: pieces made to be kept, not replaced.",
	},
	{
		icon: SparklesIcon,
		title: "Tailored to you",
		text: "Every room is different. Pick the size, fabric and finish that suit yours, and ask us when you need advice.",
	},
];

function TextImage({
	title,
	children,
	image,
}: {
	title: string;
	children: React.ReactNode;
	image: { src: string; alt: string };
}) {
	return (
		<section className="shell section-y">
			<div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-12">
				<div className="flex flex-col gap-4 md:max-w-[33rem]">
					<h2 className="text-heading-sm sm:text-heading-md">{title}</h2>
					<div className="flex flex-col gap-4 text-lead text-muted-foreground">{children}</div>
				</div>
				<div className="relative aspect-[3/2] w-full shrink-0 bg-secondary md:w-[45%]">
					<YNSMedia
						src={image.src}
						alt={image.alt}
						fill
						sizes="(min-width: 768px) 600px, 100vw"
						className="object-cover"
					/>
				</div>
			</div>
		</section>
	);
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [{ storeName, storeDescription, contactFormEnabled }, facts] = await Promise.all([
		getStoreInfo(),
		getCatalogFacts(),
	]);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};
	const hero = editorialImages.aboutHero;

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section className="shell pt-8 sm:pt-8">
				<div className="relative h-[10.5rem] w-full bg-secondary sm:h-72">
					<YNSMedia
						src={hero.src}
						alt={hero.alt}
						fill
						priority
						sizes="(min-width: 1440px) 1328px, 100vw"
						className="object-cover object-[50%_60%]"
					/>
				</div>
				<h1 className="sr-only">About {storeName}</h1>
				{/* The original's oversized wordmark, sized to the column whatever the store's name. */}
				<svg aria-hidden="true" viewBox="0 0 1000 150" className="mt-6 block w-full sm:mt-12">
					<text
						x="0"
						y="128"
						textLength="1000"
						lengthAdjust="spacingAndGlyphs"
						fill="currentColor"
						fontSize="170"
						fontWeight="500"
						style={{ textTransform: "uppercase" }}
					>
						{storeName}
					</text>
				</svg>
			</section>

			<TextImage title="Our story" image={editorialImages.story}>
				<p>
					{storeDescription ??
						`At ${storeName}, we believe a home should feel calm and be comfortable to live in. We design low, soft, modern furniture in a few honest materials and sell it direct.`}
				</p>
			</TextImage>

			<section className="bg-secondary">
				<div className="shell section-y flex flex-col gap-6 sm:gap-12">
					<h2 className="text-heading-sm sm:text-heading-md">Why us?</h2>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 wide:grid-cols-4">
						{values.map((value) => (
							<div
								key={value.title}
								className="flex flex-col justify-end gap-4 bg-background p-5 sm:min-h-[25rem]"
							>
								<span className="flex size-12 items-center justify-center rounded-full bg-secondary">
									<value.icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
								</span>
								<h3 className="text-heading-sm">{value.title}</h3>
								<p className="text-copy text-muted-foreground">{value.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<TextImage title="Our craftsmanship" image={editorialImages.craft}>
				<p>
					Quality and craftsmanship are at the heart of everything we do. We build on solid ash frames, cut
					our coffee table from a single block of travertine and choose dense, soft fabrics: furniture that is
					comfortable first and made to stand the test of time.
				</p>
				<p>
					Questions about a piece, a size or a delivery? Read the{" "}
					<Link href="/faq" className="text-foreground underline underline-offset-4">
						FAQ
					</Link>
					{contactFormEnabled ? (
						<>
							{" "}
							or{" "}
							<Link href="/contact" className="text-foreground underline underline-offset-4">
								get in touch
							</Link>
						</>
					) : null}
					.
				</p>
			</TextImage>

			<section className="bg-secondary">
				<div className="shell section-y grid grid-cols-2 gap-y-10 text-center md:grid-cols-4">
					{facts.map((fact) => (
						<div key={fact.label} className="flex flex-col gap-2">
							<span className="text-heading-lg md:text-heading-xl">{fact.value}</span>
							<span className="text-copy text-muted-foreground">{fact.label}</span>
						</div>
					))}
				</div>
			</section>

			<GetInspired />
		</>
	);
}
