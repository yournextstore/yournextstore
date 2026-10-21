import { ChevronRight, HandHeart, Leaf, Sparkles } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";
import { EllipseLink } from "@/components/ellipse-link";
import { ProductCard } from "@/components/product-card";
import { Rail } from "@/components/rail";
import { StorySlider } from "@/components/sections/story-slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { firstStill, getCatalogProducts, getCollectionTiles, getNewestProduct } from "@/lib/catalog";
import { meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [products, collections, newest, me] = await Promise.all([
		getCatalogProducts(),
		getCollectionTiles(),
		getNewestProduct(),
		meGetCached().catch(() => null),
	]);
	return { products, collections, newest, storeName: me?.store.name || "Your Next Store" };
}

/** Full-bleed photograph under a soft scrim, a quoted line, the wordmark and the ellipse CTA. */
export async function Hero() {
	const { storeName } = await getHomeData();

	return (
		<section className="relative flex h-[min(78vh,520px)] items-center justify-center overflow-hidden bg-plum md:h-[min(86vh,840px)]">
			<YNSMedia
				src="/images/pexels/hero-linen.jpg"
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover object-center"
			/>
			<div aria-hidden="true" className="absolute inset-0 bg-[#2b2023]/45" />
			<div className="relative flex flex-col items-center px-5 text-center text-white">
				<p className="text-[15px] md:text-base">&ldquo;Slow rituals for bath and body&rdquo;</p>
				<h1 className="mt-8 font-heading text-display uppercase tracking-[0.02em] md:mt-6">{storeName}</h1>
				<EllipseLink href="/products" className="mt-8 md:mt-6">
					Shop now
				</EllipseLink>
			</div>
		</section>
	);
}

const MISSION = "Botanical bath and body care, blended in small batches.";

/** Mint ticker with the mission line in the display serif. */
export function MissionMarquee() {
	return (
		<section
			aria-label="Our mission"
			className="overflow-hidden border-y border-[#c9b48a] bg-mint py-3 text-mint-foreground max-md:hidden"
		>
			<div className="flex w-max animate-marquee">
				{[0, 1].map((copy) => (
					<p
						key={copy}
						aria-hidden={copy === 1 ? "true" : undefined}
						className="flex shrink-0 gap-12 pr-12 font-heading text-[22px] uppercase whitespace-nowrap"
					>
						<span>{MISSION}</span>
						<span>{MISSION}</span>
						<span>{MISSION}</span>
					</p>
				))}
			</div>
		</section>
	);
}

/** "Trending now": picture tiles with a grey name bar and chevron, in an arrowed row. */
export async function TrendingNow() {
	const { products } = await getHomeData();
	const tiles = products.filter((p) => firstStill(p.images)).slice(0, 8);
	if (tiles.length === 0) return null;

	return (
		<div className="bg-card py-14 md:py-20">
			<Rail title="Trending now">
				{tiles.map((product) => (
					<Link
						key={product.id}
						href={`/product/${product.slug}`}
						className="group w-[calc(50%-0.5rem)] shrink-0 snap-start overflow-hidden rounded-2xl bg-subtle md:w-[calc(25%-0.75rem)]"
					>
						<div className="relative aspect-square overflow-hidden">
							<YNSMedia
								src={firstStill(product.images) ?? ""}
								alt=""
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							/>
						</div>
						<div className="flex items-center justify-between gap-2 px-3 py-5 md:px-4 md:py-6">
							<span className="truncate font-heading text-lg text-foreground md:text-[17px]">
								{product.name}
							</span>
							<ChevronRight className="size-4 shrink-0" aria-hidden="true" />
						</div>
					</Link>
				))}
			</Rail>
		</div>
	);
}

/** Sage story slider beside a white tile holding a single product still. */
export async function StorySection() {
	return (
		<section aria-label="Our story" className="bg-background py-14 md:py-20">
			<div className="container-page grid gap-4 md:grid-cols-2 md:gap-4">
				<div className="relative aspect-square overflow-hidden rounded-xl bg-card md:order-2 md:aspect-auto md:min-h-[460px]">
					<YNSMedia
						src="/images/pexels/story-tote-walk.jpg"
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<StorySlider />
			</div>
		</section>
	);
}

const VALUES = [
	{
		icon: HandHeart,
		title: "Made in small batches",
		text: "We blend, pour and cut everything in small runs, so each batch is looked after by hand.",
	},
	{
		icon: Leaf,
		title: "Every ingredient listed",
		text: "Each product page names what is inside and what it smells like, in plain words.",
	},
	{
		icon: Sparkles,
		title: "Kind to skin and senses",
		text: "Plant oils, butters and clays, scented gently with essential oils or left unscented.",
	},
];

/** Three white value cards with a green line icon, serif heading, hairline and a short line. */
export function Values() {
	return (
		<section aria-label="Our values" className="bg-background pb-16 md:pb-24">
			<div className="container-page grid gap-4 md:grid-cols-3">
				{VALUES.map(({ icon: Icon, title, text }) => (
					<div
						key={title}
						className="flex flex-col items-center rounded-xl bg-card px-6 py-8 text-center md:px-8"
					>
						<Icon className="size-9 text-leaf" strokeWidth={1.4} aria-hidden="true" />
						<h2 className="mt-5 text-title-md text-foreground">{title}</h2>
						<span aria-hidden="true" className="my-5 h-px w-full bg-border" />
						<p className="text-sm leading-relaxed text-foreground">{text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

/** Split banner: a product framed on a pastel wash beside a gradient panel with a "new arrival" card. */
export async function NewArrival() {
	const [{ newest, products, storeName }, { currency, locale, taxBehavior }] = await Promise.all([
		getHomeData(),
		getStoreConfig(),
	]);
	const product = newest ?? products[0];
	if (!product) return null;
	const image = firstStill(product.images);
	const { min } = priceRange(product.variants, taxBehavior);

	return (
		<section aria-label="New arrival" className="grid md:grid-cols-2">
			<div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f3d9e8_0%,#dcd3f3_55%,#c9d8f1_100%)] md:aspect-auto md:min-h-[640px]">
				<div className="relative aspect-[4/5] w-[62%] overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgb(72_47_54/0.5)]">
					<YNSMedia
						src="/images/pexels/lavender-pink.jpg"
						alt=""
						fill
						sizes="(max-width: 768px) 62vw, 32vw"
						className="object-cover"
					/>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center bg-[linear-gradient(160deg,#e9cfe0_0%,#e8dbe4_45%,#d9c8d6_100%)] px-5 py-14 text-center">
				<span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground">
					New arrival
				</span>
				<h2 className="mt-3 text-title-xl text-foreground">Just landed</h2>
				<Link
					href={`/product/${product.slug}`}
					className="mt-8 flex w-full max-w-[260px] flex-col gap-3 rounded-2xl bg-card p-2.5 pb-4 text-left shadow-sm transition-shadow hover:shadow-md"
				>
					<div className="relative aspect-square overflow-hidden rounded-xl bg-subtle-2">
						{image && <YNSMedia src={image} alt="" fill sizes="260px" className="object-cover" />}
						<span className="absolute top-2 right-2 rounded-full bg-[#2f6b2c] px-2 py-0.5 text-[10px] font-medium text-white">
							New arrival
						</span>
					</div>
					<span className="w-fit rounded-full bg-subtle-2 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
						{storeName}
					</span>
					<span className="text-sm font-semibold text-foreground">{product.name}</span>
					<span className="text-sm font-bold text-foreground">
						{formatMoney({ amount: min, currency, locale })}
					</span>
				</Link>
				{product.summary && (
					<p className="mt-8 max-w-sm text-sm leading-relaxed text-foreground">{product.summary}</p>
				)}
			</div>
		</section>
	);
}

/** "Best Seller": a collection photograph with overlaid copy beside a 2×2 of product cards. */
export async function BestSeller() {
	const { products, collections } = await getHomeData();
	const collection = collections[1] ?? collections[0];
	const members = collection ? products.filter((p) => collection.productIds.includes(p.id)) : [];
	const picks = (members.length >= 4 ? members : products).slice(0, 4);
	if (picks.length === 0) return null;

	return (
		<section aria-labelledby="best-seller-heading" className="bg-card py-14 md:py-20">
			<div className="container-page">
				<h2 id="best-seller-heading" className="mb-8 text-center text-title-xl text-foreground md:mb-10">
					Best Seller
				</h2>
				<div className="grid gap-4 lg:grid-cols-2">
					{collection && (
						<Link
							href={collection.href}
							className="group relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-plum"
						>
							<YNSMedia
								src="/images/pexels/forest-tote.jpg"
								alt=""
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
							/>
							<div aria-hidden="true" className="absolute inset-0 bg-[#2b2023]/40" />
							<div className="relative px-6 text-center text-white">
								<p className="text-sm">New collection</p>
								<p className="mt-2 font-heading text-title-lg">{collection.name}</p>
								<span className="mt-5 inline-flex h-10 items-center rounded-md border border-foreground/30 bg-card px-4 text-sm font-medium text-foreground">
									Shop collection
								</span>
							</div>
						</Link>
					)}
					<div className="grid grid-cols-2 gap-3 md:gap-4">
						{picks.map((product) => (
							<ProductCard key={product.id} product={product} tone="grey" />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

const PROMO_IMAGES = ["/images/pexels/promo-dried-flower.jpg", "/images/pexels/promo-vase.jpg"];
const PROMO_TITLES = ["For long evening baths", "Fresh starts in the shower"];

/** Two wide collection banners with an eyebrow, a serif line and an "Explore now" button. */
export async function PromoGrid() {
	const { collections } = await getHomeData();
	// Two banners: the first collections, topped up with the full range when the store has only one.
	const promos = [
		...collections.slice(0, 2).map(({ id, name, href }) => ({ id, name, href })),
		{ id: "all-products", name: "All products", href: "/products" },
	].slice(0, 2);

	return (
		<section aria-label="Featured collections" className="bg-background py-14 md:py-20">
			<div className="container-page grid gap-4 md:grid-cols-2">
				{promos.map((collection, index) => (
					<Link
						key={collection.id}
						href={collection.href}
						className="group relative flex aspect-[16/9] items-end overflow-hidden rounded-xl bg-plum md:aspect-[16/9]"
					>
						<YNSMedia
							src={PROMO_IMAGES[index] ?? PROMO_IMAGES[0] ?? ""}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-linear-to-r from-[#2b2023]/60 via-[#2b2023]/25 to-transparent"
						/>
						<div className="relative p-5 text-white md:p-8">
							<p className="text-sm">{collection.name}</p>
							<p className="mt-1 font-heading text-title-md md:text-title-lg">
								{PROMO_TITLES[index] ?? collection.name}
							</p>
							<span className="mt-4 inline-flex h-10 items-center rounded-md border border-foreground/40 bg-card px-4 text-sm font-semibold text-foreground">
								Explore now
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

/** "Best Sellers" carousel of product cards. */
export async function ShopTheRange() {
	const { products } = await getHomeData();
	const picks = products.slice(4, 12).length >= 4 ? products.slice(4, 12) : products.slice(0, 8);
	if (picks.length === 0) return null;

	return (
		<div className="bg-card py-14 md:py-20">
			<Rail title="Best Sellers" centered>
				{picks.map((product) => (
					<div key={product.id} className="w-[calc(50%-0.5rem)] shrink-0 snap-start md:w-[calc(25%-0.75rem)]">
						<ProductCard product={product} tone="grey" className="h-full" />
					</div>
				))}
			</Rail>
		</div>
	);
}

/** Lavender help band: a photo card with "Still need help?" beside the first FAQ questions. */
export async function HelpBand() {
	const questions = faqCategories.flatMap((category) => category.questions).slice(0, 5);

	return (
		<section aria-labelledby="faq-heading" className="bg-lavender py-12 md:py-16">
			<div className="mx-auto grid max-w-[70rem] gap-8 px-5 md:grid-cols-2 md:items-center md:gap-12 md:px-10">
				<div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-subtle-2 md:aspect-[5/4]">
					<YNSMedia
						src="/images/pexels/help-dried-plant.jpg"
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 40vw"
						className="object-cover"
					/>
					<div aria-hidden="true" className="absolute inset-0 bg-[#2b2023]/35" />
					<div className="relative text-center text-white">
						<p className="text-[15px]">Customer service</p>
						<p className="mt-2 font-heading text-title-lg">Still need help?</p>
						<Link
							href="/faq"
							className="mt-5 inline-flex h-10 items-center rounded-md border border-foreground/30 bg-card px-4 text-sm font-semibold text-foreground"
						>
							Visit help centre
						</Link>
					</div>
				</div>
				<div>
					<h2 id="faq-heading" className="text-title-xl text-foreground">
						Frequently asked questions
					</h2>
					<Accordion type="single" collapsible className="mt-6">
						{questions.map((item) => (
							<AccordionItem key={item.question} value={item.question} className="border-foreground/15">
								<AccordionTrigger className="font-heading text-[17px] font-normal text-foreground hover:no-underline">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-sm leading-relaxed text-foreground">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
