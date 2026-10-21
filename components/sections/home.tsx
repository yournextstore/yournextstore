import { cacheLife } from "next/cache";
import Link from "next/link";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import {
	EDITORIAL,
	firstStill,
	getCatalogProducts,
	getCategoryTiles,
	getCollectionTiles,
	getMatchingSet,
	getSocialLinks,
	getStoreBrand,
	picturedFirst,
} from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Centred pine kicker over a serif section title, as every section of the original opens. */
export function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
	return (
		<div className="mb-9 text-center">
			<p className="eyebrow mb-2">{eyebrow}</p>
			<h2 id={id} className="font-heading text-3xl font-semibold text-ink md:text-[2.4rem]">
				{title}
			</h2>
		</div>
	);
}

/** Three lifestyle slides over bundled editorial photographs, linking into the catalogue. */
export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const [categories, collections] = await Promise.all([getCategoryTiles(), getCollectionTiles()]);
	const pick = (i: number) => EDITORIAL.hero[i % EDITORIAL.hero.length] ?? null;
	const secondHref = collections[0]?.href ?? "/products";
	const thirdHref = categories[0]?.href ?? "/products";

	const slides: HeroSlide[] = [
		{
			eyebrow: "Organic cotton",
			title: "Soft first clothes for little ones",
			copy: "Bodysuits, sleepsuits and knits in gentle organic cotton and calm colours, made for the first months and beyond.",
			cta: "Shop new arrivals",
			href: "/products",
			image: pick(0),
		},
		{
			eyebrow: "Made to match",
			title: "Little outfits that go together",
			copy: "Bodysuits, leggings and knits in the same soft shades, so every piece pairs with the next.",
			cta: "Shop the collection",
			href: secondHref,
			image: pick(1),
		},
		{
			eyebrow: "Everyday basics",
			title: "Easy poppers, soft seams, calm colours",
			copy: "The everyday baby clothes you will reach for at every change, from the first bodysuit to toddler pyjamas.",
			cta: "Shop the basics",
			href: thirdHref,
			image: pick(2),
		},
	];
	return <HeroCarousel slides={slides} />;
}

/** The original's circular category thumbnails with a white pill label overlapping the bottom. */
export async function CategoryCircles({
	activeSlug,
	className,
}: {
	activeSlug?: string;
	className?: string;
}) {
	"use cache";
	cacheLife("minutes");
	const tiles = await getCategoryTiles(6);
	if (tiles.length === 0) return null;
	return (
		<nav aria-label="Shop by category" className={cn("container-x", className)}>
			{/* Centred wrap, not a fixed six-column grid, so three categories don't hug the left edge. */}
			<ul className="flex flex-wrap justify-center gap-x-3 gap-y-6 sm:gap-x-4 md:gap-x-6">
				{tiles.map((tile) => {
					const active = tile.slug === activeSlug;
					return (
						<li
							key={tile.id}
							className="w-[calc((100%-1.5rem)/3)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-7.5rem)/6)]"
						>
							<Link
								href={tile.href}
								aria-current={active ? "page" : undefined}
								className="group flex flex-col items-center"
							>
								<span className="relative block aspect-square w-full overflow-hidden rounded-full bg-card">
									{tile.image && (
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes="(max-width: 768px) 30vw, 180px"
											className="object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									)}
								</span>
								<span
									className={cn(
										"z-10 -mt-6 max-w-full rounded-pill px-3 py-1.5 text-center font-heading text-sm leading-tight shadow-card transition-colors sm:-mt-7 sm:px-5 sm:py-2 sm:text-base",
										active
											? "bg-primary text-primary-foreground"
											: "bg-surface text-ink group-hover:bg-primary group-hover:text-primary-foreground",
									)}
								>
									{tile.name}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

async function ProductRow({
	eyebrow,
	title,
	offset,
	limit,
	id,
}: {
	eyebrow: string;
	title: string;
	offset: number;
	limit: number;
	id: string;
}) {
	"use cache";
	cacheLife("minutes");
	const products = picturedFirst((await getCatalogProducts()).products);
	// A small catalogue wraps around rather than leaving the second row empty.
	const start = products.length > offset + limit ? offset : 0;
	const row = products.slice(start, start + limit);
	if (row.length === 0) return null;
	return (
		<section aria-labelledby={id} className="container-x py-14 md:py-16">
			<SectionTitle id={id} eyebrow={eyebrow} title={title} />
			<div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
				{row.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}

export function FeatureCollection() {
	return (
		<ProductRow
			id="feature-title"
			eyebrow="Discover our new arrivals"
			title="Feature collection"
			offset={0}
			limit={6}
		/>
	);
}

export function PopularProducts() {
	return (
		<ProductRow
			id="popular-title"
			eyebrow="More from the shop"
			title="Popular products"
			offset={6}
			limit={6}
		/>
	);
}

/** "Made to match": a cream card with a photograph and a short list of pieces that go together. */
export async function MatchingSet() {
	"use cache";
	cacheLife("minutes");
	const [set, { currency, locale, taxBehavior }] = await Promise.all([getMatchingSet(), getStoreConfig()]);
	if (set.products.length === 0) return null;
	return (
		<section aria-labelledby="set-title" className="container-x py-14 md:py-16">
			<div className="grid items-stretch gap-6 rounded-[18px] bg-card p-5 shadow-card md:grid-cols-2 md:p-9">
				<div className="relative min-h-[360px] overflow-hidden rounded-form bg-muted">
					{set.image && (
						<YNSMedia
							src={set.image}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 560px"
							className="object-cover"
						/>
					)}
				</div>
				<div className="flex flex-col justify-center">
					<p className="eyebrow mb-2">Made to match</p>
					<h2 id="set-title" className="font-heading text-3xl text-ink md:text-4xl">
						Little outfits that belong together
					</h2>
					<p className="mt-3 text-muted-foreground">
						Bodysuits, leggings and knits cut in the same soft shades, so getting dressed takes one hand and
						one minute.
					</p>
					<ul className="mt-6 divide-y divide-line">
						{set.products.map((product) => {
							const image = firstStill(product.images);
							const variant = product.variants[0];
							return (
								<li key={product.id} className="flex items-center gap-4 py-3">
									<span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-form bg-muted">
										{image && <YNSMedia src={image} alt="" fill sizes="56px" className="object-cover" />}
									</span>
									<Link
										href={`/product/${product.slug}`}
										className="min-w-0 flex-1 font-heading text-ink transition-colors hover:text-pine"
									>
										{product.name}
									</Link>
									{variant && (
										<span className="font-semibold text-pine">
											{formatMoney({ amount: displayPrice(variant, taxBehavior), currency, locale })}
										</span>
									)}
								</li>
							);
						})}
					</ul>
					<Link
						href={set.href}
						className="mt-6 inline-flex items-center justify-center self-start rounded-form bg-primary px-6 py-3 text-[13px] font-semibold tracking-wide text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
					>
						Shop {set.name}
					</Link>
				</div>
			</div>
		</section>
	);
}

/**
 * The original's square photo strip ("Our Instagram"): links to the store's Instagram when one is
 * set, otherwise each photograph opens its product.
 */
export async function PhotoStrip() {
	"use cache";
	cacheLife("minutes");
	const [{ products }, socials, brand] = await Promise.all([
		getCatalogProducts(),
		getSocialLinks(),
		getStoreBrand(),
	]);
	const instagram = socials.find((social) => social.key === "instagram");
	const tiles = picturedFirst([...products].reverse())
		.flatMap((product) => {
			const image = firstStill(product.images);
			return image ? [{ id: product.id, name: product.name, slug: product.slug, image }] : [];
		})
		.slice(0, 5);
	if (tiles.length < 2) return null;
	const handle = instagram?.href.replace(/\/+$/, "").split("/").at(-1);
	return (
		<section aria-labelledby="moments-title" className="py-14 md:py-16">
			<div className="container-x">
				<SectionTitle
					id="moments-title"
					eyebrow={handle ? `@${handle}` : `Life at ${brand.name}`}
					title={instagram ? "Our Instagram" : "Fresh from the shop"}
				/>
			</div>
			<ul className="container-x grid grid-cols-2 gap-3 md:grid-cols-5">
				{tiles.map((tile, i) => (
					<li key={tile.id} className={cn(i === 4 && "col-span-2 md:col-span-1")}>
						<a
							href={instagram ? instagram.href : `/product/${tile.slug}`}
							{...(instagram ? { target: "_blank", rel: "noopener noreferrer" } : {})}
							aria-label={instagram ? `${brand.name} on Instagram` : tile.name}
							className={cn(
								"group relative block overflow-hidden rounded-form bg-muted",
								i === 4 ? "aspect-[2/1] md:aspect-square" : "aspect-square",
							)}
						>
							<YNSMedia
								src={tile.image}
								alt=""
								fill
								sizes="(max-width: 768px) 50vw, 20vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<span className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/20" />
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
