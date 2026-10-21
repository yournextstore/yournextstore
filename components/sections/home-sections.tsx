import { ArrowRightIcon, RulerIcon, ShoppingCartIcon, TruckIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { Carousel, CarouselItem } from "@/components/carousel";
import { ProductCard } from "@/components/product-card";
import { FeaturedGallery } from "@/components/sections/featured-gallery";
import { ShopTheLook } from "@/components/sections/shop-the-look";
import { type Slide, Slideshow } from "@/components/sections/slideshow";
import { Skeleton } from "@/components/ui/skeleton";
import {
	type FeatureProduct,
	getCategoryTiles,
	getCollectionTiles,
	getRailProducts,
	productStill,
	type ShowcaseTile,
} from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { EDITORIAL, listingCover } from "@/lib/editorial";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

const SLIDE_COPY = [
	{
		eyebrow: "Just dropped",
		heading: "Less noise, better layers",
		body: "Everyday clothes designed to move with you. From weekend layers to the shirt you wear on repeat, find what fits your world.",
		cta: "Explore the drop",
	},
	{
		eyebrow: "New season",
		heading: "Made for the in-between",
		body: "Jackets, knits and easy layers for the days that cannot make up their mind.",
		cta: "Shop new arrivals",
	},
	{
		eyebrow: "The edit",
		heading: "Pieces worth keeping",
		body: "A short list of favourites in quiet colours, chosen to be worn together and loved for years.",
		cta: "See the edit",
	},
];

export function HomeSlideshow() {
	const slides: Slide[] = EDITORIAL.slides.flatMap((photo, index) => {
		const copy = SLIDE_COPY[index];
		return copy ? [{ ...copy, image: photo.src, href: "/products" }] : [];
	});
	return <Slideshow slides={slides} />;
}

export async function BestSellers() {
	const products = await getRailProducts(8);
	if (products.length === 0) return null;
	return (
		<Carousel
			label="Shop our best selling"
			heading={<h2 className="text-heading-lg">Shop our best selling</h2>}
			intro={
				<p className="text-body-sm text-muted-foreground">
					The pieces our customers come back for, again and again. Start here if you are new, or pick up where
					you left off.
				</p>
			}
			className="py-14 lg:py-16"
		>
			{products.map((product) => (
				<CarouselItem key={product.id}>
					<ProductCard product={product} />
				</CarouselItem>
			))}
		</Carousel>
	);
}

/** Full-width photograph with a caption block, where the original plays its brand video. */
export function StoryBanner() {
	return (
		<section className="relative h-[28rem] overflow-hidden bg-ink text-white md:h-[34rem] lg:h-[40rem]">
			<YNSMedia src={EDITORIAL.story.src} alt="" fill sizes="100vw" className="object-cover" />
			<div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-black/10" />
			<div className="page-x absolute inset-x-0 bottom-0 pb-12 lg:pb-16">
				<p className="text-body-sm">Behind the pieces</p>
				<h2 className="mt-3 text-heading-xl">Stories worth telling.</h2>
				<p className="mt-4 max-w-2xl text-body-sm text-white/90">
					Every piece starts with a reason to exist: a cloth worth working with, a cut that layers well, a
					detail that makes getting dressed a little easier. Fewer things, worn more often.
				</p>
				<Link
					href="/about"
					className="mt-6 inline-flex h-11 items-center rounded-md border border-white px-5 text-body-sm transition-colors hover:bg-white hover:text-foreground"
				>
					Read our story
				</Link>
			</div>
		</section>
	);
}

async function getShowcaseTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, categories] = await Promise.all([
		getCollectionTiles(limit),
		getCategoryTiles(limit + 2),
	]);
	// Tiles without an image of their own each get a different editorial photograph.
	let spare = 0;
	return [...collections, ...categories].slice(0, limit + 2).map((tile) => {
		if (tile.image) return tile;
		const photo = EDITORIAL.listings[spare++ % EDITORIAL.listings.length] ?? listingCover(tile.id);
		return { ...tile, image: photo.src };
	});
}

export async function FeaturedCategories() {
	const tiles = (await getShowcaseTiles(3)).slice(0, 3);
	if (tiles.length === 0) return null;
	return (
		<section aria-label="Shop by category" className="page-x py-14 lg:py-16">
			<ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 md:mx-0 md:scroll-px-0 md:grid md:grid-cols-3 md:px-0">
				{tiles.map((tile) => (
					<li key={tile.id} className="w-[72%] shrink-0 snap-start md:w-auto">
						<Link
							href={tile.href}
							className="group relative flex aspect-5/6 flex-col items-center justify-center overflow-hidden rounded-md bg-ink p-6 text-center text-white"
						>
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									sizes="(max-width: 768px) 72vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							)}
							<span aria-hidden className="absolute inset-0 bg-black/35" />
							<span className="relative font-serif text-heading-md">{tile.name}</span>
							<span className="relative mt-6 inline-flex h-10 items-center rounded-md bg-white px-4 text-body-sm text-foreground">
								Shop now
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

function FeaturedPurchaseSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-7 w-28" />
			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-10 w-32" />
			<Skeleton className="h-12 w-full rounded-md" />
		</div>
	);
}

async function getFeaturedProduct(product: FeatureProduct) {
	"use cache";
	cacheLife("minutes");
	return commerce.productGet({ idOrSlug: product.slug }).catch(() => null);
}

/** The original's "single product" block: gallery on the left, purchase controls on the right. */
export async function FeaturedProduct() {
	// A purchasable product with the fullest gallery, so the block's thumbnails have something to show.
	const products = (await getRailProducts(100)).filter((p) => productStill(p));
	const purchasable = products.filter((p) => p.variants.some((v) => v.stock === null || v.stock > 0));
	const pick = (purchasable.length > 0 ? purchasable : products).reduce<FeatureProduct | undefined>(
		(best, p) => (!best || p.images.length > best.images.length ? p : best),
		undefined,
	);
	const product = pick ? await getFeaturedProduct(pick) : null;
	if (!product) return null;
	const images = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];
	return (
		<section
			aria-label="Featured product"
			className="page-x grid gap-8 py-14 md:grid-cols-2 md:gap-10 lg:gap-14 lg:py-16"
		>
			<FeaturedGallery images={images} productName={product.name} />
			<div className="space-y-6 md:py-2">
				<h2 className="text-heading-lg text-balance">{product.name}</h2>
				<Suspense fallback={<FeaturedPurchaseSkeleton />}>
					<AddToCartButton
						compact
						variants={product.variants}
						product={{ id: product.id, name: product.name, slug: product.slug, images: product.images }}
						summary={product.summary}
						volumePricingTiers={product.volumePricingTiers}
					/>
				</Suspense>
				<Link
					href={`/product/${product.slug}`}
					className="inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 text-body-sm"
				>
					View full details
					<ArrowRightIcon aria-hidden className="size-3.5" strokeWidth={1.5} />
				</Link>
			</div>
		</section>
	);
}

export async function ShopTheLookSection() {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const picks = (await getRailProducts(12)).filter((p) => productStill(p)).slice(0, 3);
	if (picks.length === 0) return null;
	const items = picks.map((product) => {
		const { min } = product.variants.length > 0 ? priceRange(product.variants, taxBehavior) : { min: null };
		return {
			id: product.id,
			name: product.name,
			href: `/product/${product.slug}`,
			image: productStill(product),
			price: min !== null ? formatMoney({ amount: min, currency, locale }) : null,
		};
	});
	return (
		<section className="page-x py-14 lg:py-16">
			<h2 className="mb-8 text-center text-heading-lg">Shop the look</h2>
			<ShopTheLook image={EDITORIAL.look.src} items={items} />
		</section>
	);
}

export async function PromotionGrid() {
	const promos = (await getShowcaseTiles(3)).slice(3, 5);
	if (promos.length < 2) return null;
	const copy = [
		{
			body: "Complete the look with the pieces that make it yours, gathered in one place.",
			cta: "Shop the edit",
		},
		{
			body: "Easy to wear and made for every day. Find the pieces you will reach for first.",
			cta: "Shop now",
		},
	];
	return (
		<section aria-label="Promotions" className="page-x grid gap-3 py-14 md:grid-cols-2 lg:gap-4 lg:py-16">
			{promos.map((promo, index) => (
				<div
					key={promo.id}
					className="relative flex aspect-4/5 flex-col justify-end overflow-hidden rounded-md bg-ink p-6 text-white md:aspect-auto md:h-[36rem] lg:h-[42rem] lg:p-8"
				>
					{promo.image && (
						<YNSMedia
							src={promo.image}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
						/>
					)}
					<span
						aria-hidden
						className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
					/>
					<div
						className={index === 1 ? "relative md:ml-auto md:max-w-sm md:text-right" : "relative max-w-sm"}
					>
						<h2 className="text-heading-md line-clamp-2">{promo.name}</h2>
						<p className="mt-3 text-body-sm text-white/90 line-clamp-3">
							{promo.description || copy[index]?.body}
						</p>
						<Link
							href={promo.href}
							className="mt-5 inline-flex h-10 items-center rounded-md bg-white px-4 text-body-sm text-foreground transition-colors hover:bg-secondary"
						>
							{copy[index]?.cta}
						</Link>
					</div>
				</div>
			))}
		</section>
	);
}

export function ImageGallery() {
	return (
		<section className="page-x py-14 lg:px-24 lg:py-16">
			<h2 className="mb-8 text-center text-heading-lg">From the lookbook</h2>
			<ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
				{EDITORIAL.gallery.map((photo) => (
					<li key={photo.src}>
						<Link
							href="/products"
							className="group relative block aspect-square overflow-hidden rounded-md bg-secondary"
						>
							<YNSMedia
								src={photo.src}
								alt={photo.alt}
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

const PROMISES = [
	{ icon: TruckIcon, title: "Shipping", body: "Every order packed with care and sent on its way." },
	{
		icon: RulerIcon,
		title: "Consciously crafted",
		body: "Quality materials, made to last through seasons and years.",
	},
	{
		icon: ShoppingCartIcon,
		title: "Shopping experience",
		body: "Easy browsing, secure checkout and help when you need it.",
	},
];

export function Promises() {
	return (
		<section aria-label="Our promises" className="bg-band">
			<ul className="page-x grid gap-12 py-16 text-center md:grid-cols-3 md:gap-8 lg:py-20">
				{PROMISES.map((promise) => (
					<li key={promise.title} className="flex flex-col items-center">
						<promise.icon aria-hidden className="size-8" strokeWidth={1.25} />
						<h3 className="mt-5 text-heading-sm">{promise.title}</h3>
						<p className="mt-3 max-w-xs text-body-sm">{promise.body}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
