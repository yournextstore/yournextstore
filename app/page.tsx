import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { ProductCard } from "@/components/product-card";
import { QuickAddButton } from "@/components/quick-add-button";
import { Hero, type HeroSlide } from "@/components/sections/hero";
import { LookTile } from "@/components/sections/look-tile";
import { Newsletter } from "@/components/sections/newsletter";
import {
	type CatalogProduct,
	type EditorialTile,
	firstStill,
	getCatalogProducts,
	getCategoryTiles,
	wornStill,
} from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import bannerStillLife from "@/public/images/pexels/banner-still-life.jpg";
import bannerTrench from "@/public/images/pexels/banner-trench.jpg";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Campaign photography from the original theme (Unsplash licence) and Pexels (see NOTICE.md);
// tiles, carousels and looks show the store's own photographs.
const HERO_SLIDES: HeroSlide[] = [
	{
		eyebrow: "THE NEW SEASON",
		headline: "New collection — now in",
		note: "campaign 01 · the rail, after hours",
		image: "/images/hero-1.jpg",
		href: "/products",
	},
	{
		eyebrow: "THE GIFTING EDIT",
		headline: "Pieces worth giving",
		note: "campaign 02 · the gift table, candlelight",
		image: "/images/hero-2.jpg",
		href: "/products?sort=price-desc",
	},
	{
		eyebrow: "AFTER DARK",
		headline: "Made for low light",
		note: "campaign 03 · studio, violet",
		image: "/images/hero-3.jpg",
		href: "/products",
	},
];

const LOOK_SPANS = [2, 1, 1, 1, 2, 1, 1, 1] as const;
// Gift cards photograph as printed cards, not as something worn.
const GIFT_CARD = /gift ?card|voucher/i;

async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [products, tiles, seo] = await Promise.all([getCatalogProducts(), getCategoryTiles(), getStoreSeo()]);

	// Looks: products photographed on a model, taken round-robin across categories so the
	// masonry does not show eight of the same thing.
	const worn = products.filter(
		(p) =>
			(p.images ?? []).filter((img) => !isVideoUrl(img)).length > 1 &&
			!GIFT_CARD.test(`${p.name} ${p.category?.name ?? ""}`),
	);
	const byCategory = Map.groupBy(worn, (p) => p.category?.id ?? "none");
	const queues = [...byCategory.values()];
	const roundRobin = Array.from({ length: Math.max(0, ...queues.map((q) => q.length)) }, (_, i) =>
		queues.flatMap((q) => (q[i] ? [q[i]] : [])),
	).flat();
	// The masonry needs all eight looks; fewer fall back to an even row of equal tiles.
	const full = roundRobin.length >= LOOK_SPANS.length;
	const lookProducts = full ? roundRobin.slice(0, LOOK_SPANS.length) : roundRobin.slice(0, 4);
	const looks = lookProducts.map((product, i) => {
		const companion =
			lookProducts.find((p, j) => j > i && p.category?.id !== product.category?.id) ??
			lookProducts.find((p) => p.id !== product.id && p.category?.id !== product.category?.id);
		return {
			product,
			image: wornStill(product.images) ?? "",
			items: companion ? [product, companion] : [product],
			span: full ? (LOOK_SPANS[i] ?? 1) : (1 as const),
			note: `look ${String(i + 1).padStart(2, "0")} · ${(product.category?.name ?? "the edit").toLowerCase()}`,
		};
	});

	const signature = [...products]
		.sort((a, b) => Number(BigInt(b.variants[0]?.price ?? "0") - BigInt(a.variants[0]?.price ?? "0")))
		.filter((p) => !products.slice(0, 10).includes(p))
		.slice(0, 10);

	return {
		// Photographed pieces first, so the carousel never opens on an empty tile.
		newIn: [
			...products.filter((p) => firstStill(p.images)),
			...products.filter((p) => !firstStill(p.images)),
		].slice(0, 10),
		signature: signature.length >= 4 ? signature : products.slice(0, 10).reverse(),
		// An even row: a lone tile under three would break the grid on phones.
		tiles: tiles.slice(0, tiles.length >= 4 ? 4 : tiles.length - (tiles.length % 2)),
		looks,
		masonry: full,
		description: seo.storeDescription,
	};
}

function CategoryTiles({ tiles }: { tiles: EditorialTile[] }) {
	if (tiles.length === 0) return null;
	return (
		<section
			aria-label="Shop by category"
			className="mx-auto max-w-[1640px] px-4 pt-16 sm:px-5 sm:pt-24 lg:px-9"
		>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{tiles.map((tile) => (
					<Link
						key={tile.id}
						href={tile.href}
						className="group relative block aspect-[3/4.2] overflow-hidden bg-tint"
					>
						<YNSMedia
							src={tile.image}
							alt=""
							fill
							sizes="(min-width: 1024px) 25vw, 50vw"
							className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
						/>
						<span className="absolute inset-0 bg-ink/25 transition-colors duration-300 group-hover:bg-ink/35" />
						<span className="absolute inset-0 flex items-center justify-center p-3 text-center">
							<span className="cap-tag link-u text-white [text-underline-offset:7px]">{tile.name}</span>
						</span>
						<span aria-hidden className="note absolute bottom-2.5 left-3 text-white/75">
							{tile.count} {tile.count === 1 ? "piece" : "pieces"}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

const BANNERS = [
	{ name: "New arrivals", href: "/products", image: bannerTrench, position: "object-[50%_25%]" },
	{
		name: "Signature pieces",
		href: "/products?sort=price-desc",
		image: bannerStillLife,
		position: "object-[50%_45%]",
	},
] as const;

function DoubleBanners() {
	return (
		<section
			aria-label="Featured edits"
			className="mx-auto max-w-[1640px] px-4 pt-16 sm:px-5 sm:pt-24 lg:px-9"
		>
			<div className="grid gap-4 md:grid-cols-2">
				{BANNERS.map((banner) => (
					<Link
						key={banner.name}
						href={banner.href}
						className="group relative block aspect-[4/3] overflow-hidden bg-stage"
					>
						<Image
							src={banner.image}
							alt=""
							fill
							placeholder="blur"
							sizes="(min-width: 768px) 50vw, 100vw"
							className={`object-cover ${banner.position} transition-transform duration-[900ms] group-hover:scale-[1.03]`}
						/>
						<span className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
						<span className="absolute bottom-7 left-6 flex flex-col items-start gap-4 text-white sm:bottom-10 sm:left-10">
							<span className="max-w-[14ch] text-[22px] uppercase leading-snug tracking-[0.18em] sm:text-[26px]">
								{banner.name}
							</span>
							<span className="link-u text-[10px] uppercase tracking-[0.22em]">Shop now</span>
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

function WideBanner() {
	return (
		<section className="relative mt-20 h-[74vh] min-h-[520px] overflow-hidden bg-stage sm:mt-28">
			<Image
				src="/images/banner-wide.jpg"
				alt=""
				fill
				sizes="100vw"
				className="object-cover object-[50%_35%]"
			/>
			<div className="absolute inset-0 bg-ink/45" />
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-5 text-center text-white">
				<p className="text-[11px] tracking-[0.3em]">THE SEASON EDIT</p>
				<h2 className="max-w-[18ch] text-[clamp(26px,3vw,40px)] font-normal uppercase leading-tight tracking-[0.2em]">
					Shape the season
				</h2>
				<Link href="/products" className="link-u text-[10px] uppercase tracking-[0.22em]">
					Shop now
				</Link>
			</div>
		</section>
	);
}

async function LookItem({ product }: { product: CatalogProduct }) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const { min, max } = priceRange(product.variants, taxBehavior);
	const price = formatMoney({ amount: min, currency, locale });
	const image = firstStill(product.images);
	const single =
		product.variants.length === 1 && product.variants[0]?.stock !== 0 ? product.variants[0] : null;
	return (
		<div className="flex items-center gap-3">
			<span className="relative h-[52px] w-[40px] flex-none overflow-hidden bg-tint">
				{image && <YNSMedia src={image} alt="" fill sizes="40px" className="object-cover" />}
			</span>
			<span className="flex min-w-0 flex-1 flex-col gap-1">
				<Link
					href={`/product/${product.slug}`}
					className="line-clamp-2 text-[10px] uppercase leading-snug tracking-[0.12em]"
				>
					{product.name}
				</Link>
				<span className="text-[11px] text-soft">{min === max ? price : `From ${price}`}</span>
			</span>
			{single ? (
				<QuickAddButton
					className="link-u flex-none cursor-pointer text-[9px] uppercase tracking-[0.16em] [text-underline-offset:4px]"
					variantId={single.id}
					variantSku={single.sku}
					variantPrice={single.price}
					variantPriceGross={single.priceGross}
					variantImages={single.images}
					product={{ id: product.id, name: product.name, slug: product.slug, images: product.images }}
				/>
			) : (
				<Link
					href={`/product/${product.slug}`}
					className="link-u flex-none text-[9px] uppercase tracking-[0.16em] [text-underline-offset:4px]"
				>
					Choose
				</Link>
			)}
		</div>
	);
}

export default async function Home() {
	const { newIn, signature, tiles, looks, masonry, description } = await getHomeData();

	return (
		<>
			<Hero slides={HERO_SLIDES} />
			<CategoryTiles tiles={tiles} />
			<DoubleBanners />

			{newIn.length > 0 && (
				<Carousel title="New in" id="home-new-in">
					{newIn.map((product) => (
						<div key={product.id} className="w-[min(300px,72vw)] flex-none snap-start">
							<ProductCard product={product} badge="New in" sizes="300px" />
						</div>
					))}
				</Carousel>
			)}

			<WideBanner />

			{looks.length >= 4 && (
				<section
					id="looks"
					aria-labelledby="home-looks"
					className="mx-auto max-w-[1640px] scroll-mt-28 px-4 pt-20 sm:px-5 sm:pt-28 lg:px-9"
				>
					<div className="mb-8 flex items-end justify-between gap-4">
						<h2 id="home-looks" className="text-[15px] font-normal uppercase tracking-[0.26em]">
							Shop the look
						</h2>
						<p className="cap-xs text-faint">Tap + to shop each look</p>
					</div>
					<div
						className={`grid grid-cols-2 gap-4 ${masonry ? "auto-rows-[230px] lg:auto-rows-[250px] lg:grid-cols-5" : "auto-rows-[260px] sm:auto-rows-[360px] lg:grid-cols-4"}`}
					>
						{looks.map((look) => (
							<LookTile key={look.product.id} image={look.image} note={look.note} span={look.span}>
								{look.items.map((item) => (
									<LookItem key={item.id} product={item} />
								))}
							</LookTile>
						))}
					</div>
				</section>
			)}

			{signature.length > 0 && (
				<Carousel title="Signature pieces" id="home-signature">
					{signature.map((product) => (
						<div key={product.id} className="w-[min(300px,72vw)] flex-none snap-start">
							<ProductCard product={product} sizes="300px" />
						</div>
					))}
				</Carousel>
			)}

			<section className="mx-auto flex max-w-[900px] flex-col items-center gap-6 px-5 py-16 text-center sm:gap-8 sm:py-32">
				<h2 className="text-[11px] font-normal tracking-[0.3em]">THE HOUSE</h2>
				<p className="text-[clamp(19px,2.2vw,26px)] leading-relaxed tracking-[0.06em] text-pretty">
					{description && description.length > 60
						? description
						: "Made for people who choose slowly. We keep the pieces that hold up through long days and longer years — considered proportions, quiet design, nothing that shouts."}
				</p>
				<ul className="cap flex flex-wrap justify-center gap-x-14 gap-y-2 text-soft">
					<li>Chosen with care</li>
					<li>Quiet design</li>
					<li>Meant to be kept</li>
				</ul>
			</section>

			<Newsletter />
		</>
	);
}
