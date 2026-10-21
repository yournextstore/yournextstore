import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { firstStill, getCategoryTiles, getHeroSlides, picturedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { ALL_PRODUCTS_TILE_IMAGE } from "@/lib/editorial";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

/** The black strip under the header. */
export function AnnouncementBar() {
	return (
		<div className="flex h-10 w-full items-center justify-center bg-ink px-4 text-center text-sm whitespace-nowrap text-white sm:text-base/[18px]">
			New arrivals every week
			<Link href="/products" className="ml-2 underline hover:no-underline">
				Shop Now
			</Link>
		</div>
	);
}

export async function HeroSection() {
	"use cache";
	cacheLife("minutes");
	const [slides, { currency, locale, taxBehavior }] = await Promise.all([getHeroSlides(), getStoreConfig()]);

	return (
		<HeroCarousel
			slides={slides.map((slide) => {
				const { min } =
					slide.product.variants.length > 0 ? priceRange(slide.product.variants, taxBehavior) : { min: null };
				return {
					id: slide.id,
					title: slide.title,
					subtitle: slide.subtitle,
					ctaText: slide.ctaText,
					ctaHref: slide.ctaHref,
					image: slide.image,
					imageAlt: slide.imageAlt,
					product: {
						name: slide.product.name,
						href: `/product/${slide.product.slug}`,
						image: firstStill(slide.product.images),
						price: min !== null ? formatMoney({ amount: min, currency, locale }) : null,
					},
				};
			})}
		/>
	);
}

export async function NewArrivalsSection() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 16, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	// Pictured products first, and a free item (a sample or a bundle shell) after the priced ones.
	const priced = (product: (typeof data)[number]) => product.variants.some((v) => BigInt(v.price) > 0n);
	const pictured = picturedFirst([...data.filter(priced), ...data.filter((product) => !priced(product))]);
	if (pictured.length < 4) return null;
	// Whole rows only: 4 columns on desktop.
	const products = pictured.slice(0, pictured.length >= 8 ? 8 : 4);

	return (
		<section className="relative w-full py-16 sm:py-20 lg:py-24">
			<div className="wide-container">
				<div className="mb-12">
					<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						New Arrivals
					</h2>
					<p className="mt-2 text-base text-muted-foreground lg:text-lg">Fresh picks, just landed</p>
				</div>
				<div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
					{products.map((product, index) => (
						<div
							key={product.id}
							className="relative overflow-hidden rounded-lg bg-secondary/5 transition-colors duration-300 hover:bg-secondary/40"
						>
							<ProductCard
								product={product}
								priority={index < 2}
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 330px"
							/>
							{index < 3 && (
								<span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-foreground px-2 py-1 text-xs font-medium text-background">
									NEW
								</span>
							)}
						</div>
					))}
				</div>
				<div className="mt-12 text-center">
					<Link
						href="/products"
						className="group inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
					>
						View all new arrivals
						<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</section>
	);
}

export async function FeaturedCategoriesSection() {
	"use cache";
	cacheLife("minutes");
	const tiles = await getCategoryTiles(4);
	if (tiles.length === 0) return null;
	// Even tiles fill the two-column grid: an odd count is topped up with the full range.
	const shown =
		tiles.length % 2 === 1
			? [
					...tiles,
					{
						id: "all-products",
						name: "All Products",
						href: "/products",
						image: ALL_PRODUCTS_TILE_IMAGE,
						description: "",
					},
				]
			: tiles;

	return (
		<section className="relative w-full py-24">
			<div className="wide-container">
				<div className="mb-12 text-center">
					<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						Featured Categories
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">Explore our curated categories</p>
				</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
					{shown.map((tile) => (
						<Link
							key={tile.id}
							href={tile.href}
							className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
						>
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									sizes="(max-width: 640px) 100vw, 700px"
									className="object-cover transition-transform duration-700 group-hover:scale-110"
								/>
							)}
							<span className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
							<span className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">
								<span className="mb-2 text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:-translate-y-1">
									{tile.name}
								</span>
								<span className="flex items-center gap-2 text-base font-semibold">
									<span className="relative">
										Shop Now
										<span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full" />
									</span>
									<ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
								</span>
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
