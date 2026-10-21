import Link from "next/link";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	getCategoryTiles,
	getCollectionTiles,
	getHomeProducts,
	getStoreBrand,
	type ShowcaseTile,
} from "@/lib/catalog";
import { HERO_FALLBACK_IMAGES, pickEditorial } from "@/lib/editorial";
import { btnPrimaryClass, eyebrowClass, pageContainerClass, sectionTitleClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const MARQUEE_ITEMS = [
	"Mohair Teddy Bears",
	"Velvet Bunnies",
	"Woodland Friends",
	"First Comforters",
	"Jointed by Hand",
	"Made to Be Kept",
];

/** Hero slides: one editorial photograph per category, topped up with the shop and the about page. */
function heroSlides(categories: ShowcaseTile[], storeName: string): HeroSlide[] {
	const named = categories.slice(0, 3);
	const images = pickEditorial(
		named.map((c) => c.name),
		"hero",
	);
	const slides: HeroSlide[] = named.map((c, i) => ({
		image: images[i] ?? HERO_FALLBACK_IMAGES[i % HERO_FALLBACK_IMAGES.length] ?? "",
		label: c.name,
		category: "Shop the family",
		href: c.href,
		cta: "Shop now",
	}));
	const extras: HeroSlide[] = [
		{ image: "", label: "Every friend in the shop", category: storeName, href: "/products", cta: "Shop all" },
		{ image: "", label: "Our story", category: storeName, href: "/about", cta: "Read more" },
		{
			image: "",
			label: "New arrivals",
			category: storeName,
			href: "/products?sort=newest",
			cta: "Shop now",
		},
	];
	const used = new Set(slides.map((s) => s.image));
	for (const extra of extras) {
		if (slides.length >= 3) break;
		const image = HERO_FALLBACK_IMAGES.find((src) => !used.has(src)) ?? HERO_FALLBACK_IMAGES[0] ?? "";
		used.add(image);
		slides.push({ ...extra, image });
	}
	return slides;
}

/** Hero: the cream-to-taupe canvas with two blurred blooms, a frosted glass card and the product carousel. */
export async function HomeHero() {
	const [categories, brand] = await Promise.all([getCategoryTiles(3), getStoreBrand()]);
	const slides = heroSlides(categories, brand.name);

	return (
		<section className="hero-canvas relative flex min-h-[90vh] items-center overflow-hidden lg:min-h-[calc(100vh-7rem)]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-10 right-20 size-[600px] animate-pulse-slow rounded-full bg-gold/20 blur-[120px]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute bottom-10 left-10 size-[500px] animate-float rounded-full bg-crimson/20 blur-[100px]"
			/>

			<div className="relative z-10 mx-auto grid w-full max-w-screen-xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-12 lg:py-20">
				<div className="order-2 animate-fade-up rounded-[2.5rem] border border-white/50 bg-white/30 p-8 shadow-luxury-lg backdrop-blur-2xl lg:order-1 lg:p-12">
					<p className="mb-6 font-body text-xs font-medium uppercase tracking-[0.4em] text-royal/85">
						Curated with care — {brand.name}
					</p>
					<h1 className="mb-8 font-display text-5xl leading-tight text-royal sm:text-7xl xl:text-8xl">
						Play.
						<br />
						<em className="font-medium text-crimson not-italic drop-shadow-sm">Dream.</em>
						<br />
						Treasure.
					</h1>
					<p className="mb-10 max-w-md font-body text-base leading-relaxed text-earth lg:text-lg">
						Heirloom teddy bears, velvet bunnies and woodland friends in mohair, alpaca and linen — soft
						enough to hug every night, made well enough to keep.
					</p>
					<div className="flex flex-col gap-5 sm:flex-row">
						<Link
							href="/products"
							className="inline-flex items-center justify-center rounded-full bg-crimson px-8 py-4 font-body text-xs uppercase tracking-widest text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-crimson-deep hover:shadow-glow-primary"
						>
							Explore Collection
						</Link>
						<Link
							href="#best-sellers"
							className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/50 px-8 py-4 font-body text-xs uppercase tracking-widest text-royal transition-all duration-300 hover:bg-white/80 hover:shadow-luxury"
						>
							Our Picks
						</Link>
					</div>
				</div>

				{slides.length > 0 && (
					<div className="relative order-1 animate-fade-up [animation-delay:0.3s] lg:order-2">
						<HeroCarousel slides={slides} />
					</div>
				)}
			</div>

			<div
				aria-hidden="true"
				className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-2 lg:flex"
			>
				<span className="font-body text-2xs uppercase tracking-widest text-earth-soft">Scroll</span>
				<span className="h-8 w-px bg-earth/40" />
			</div>
		</section>
	);
}

/** The violet strip of spaced capitals that runs under the hero. */
export function Marquee() {
	return (
		<div className="overflow-hidden bg-royal py-4">
			<div className="marquee-track flex w-max animate-marquee">
				{[0, 1].map((copy) => (
					<ul key={copy} aria-hidden={copy === 1} className="flex shrink-0">
						{MARQUEE_ITEMS.map((item) => (
							<li
								key={item}
								className="flex items-center whitespace-nowrap font-body text-xs uppercase tracking-widest text-cream/85"
							>
								<span className="px-6">{item}</span>
								<span aria-hidden="true" className="text-gold">
									✦
								</span>
							</li>
						))}
					</ul>
				))}
			</div>
		</div>
	);
}

export async function BestSellers() {
	const { bestSellers } = await getHomeProducts();
	if (bestSellers.length === 0) return null;
	return (
		<div id="best-sellers" className="scroll-mt-24">
			<ProductGrid
				eyebrow="Curated Favourites"
				title="Our Picks"
				products={bestSellers}
				viewAllLabel="View All Products"
			/>
		</div>
	);
}

function ShowcaseCard({ tile, wide = false }: { tile: ShowcaseTile; wide?: boolean }) {
	return (
		<Link
			href={tile.href}
			className={cn(
				"group relative block h-60 overflow-hidden rounded-xl bg-royal lg:h-72",
				// An odd last tile spans the two-column phone grid instead of sitting alone.
				wide && "col-span-2 md:col-span-1",
			)}
		>
			{tile.image && (
				<YNSMedia
					src={tile.image}
					alt=""
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
					className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
				/>
			)}
			<div className="absolute inset-0 bg-royal/55 transition-colors duration-300 group-hover:bg-crimson/60" />
			<div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
				<span className="font-display text-xl leading-tight text-cream drop-shadow-md lg:text-2xl">
					{tile.name}
				</span>
				<span className="mt-2 translate-y-2 font-body text-2xs uppercase tracking-widest text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
					Browse <span aria-hidden="true">&rarr;</span>
				</span>
			</div>
		</Link>
	);
}

/** "Browse by Type": the categories as photo tiles under a violet wash that turns crimson on hover. */
export async function CategoryShowcase() {
	const categories = await getCategoryTiles(6);
	if (categories.length === 0) return null;
	const cols = Math.min(categories.length, 6);
	return (
		<section className="bg-royal/5 py-20">
			<div className="mx-auto max-w-screen-xl px-6 lg:px-12">
				<div className="mb-12 text-center">
					<p className={eyebrowClass}>Browse by Type</p>
					<h2 className={sectionTitleClass}>Collections</h2>
				</div>
				<div
					className={cn(
						"mx-auto grid grid-cols-2 gap-4 md:grid-cols-3",
						cols >= 6 ? "max-w-6xl lg:grid-cols-6" : cols === 5 ? "max-w-5xl lg:grid-cols-5" : "max-w-4xl",
						cols === 4 && "lg:grid-cols-4",
					)}
				>
					{categories.map((tile, i) => (
						<ShowcaseCard
							key={tile.id}
							tile={tile}
							wide={categories.length % 2 === 1 && i === categories.length - 1}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

/** "Hand-Picked": the asymmetric grid, one large tile beside four regular cards. */
export async function FeaturedGrid() {
	const { featured } = await getHomeProducts();
	const [lead, ...rest] = featured;
	if (!lead) return null;
	return (
		<section className={pageContainerClass}>
			<div className="mb-12 flex items-end justify-between">
				<div>
					<p className={eyebrowClass}>Worth a Look</p>
					<h2 className={sectionTitleClass}>Featured</h2>
				</div>
				<Link
					href="/products"
					className="hidden font-body text-xs uppercase tracking-widest text-earth-soft transition-colors hover:text-crimson lg:block"
				>
					View All <span aria-hidden="true">&rarr;</span>
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				<ProductCard product={lead} featured className="col-span-2 lg:row-span-2" />
				{/* Five beside and under the lead fill the desktop grid; phones show four (an even pair). */}
				{rest.slice(0, 5).map((product, i) => (
					<ProductCard
						key={product.id}
						product={product}
						className={i === 4 ? "hidden lg:flex" : undefined}
					/>
				))}
			</div>
		</section>
	);
}

/** The earth-brown philosophy band: a ghosted initial, serif headline and three figures from the catalogue. */
export async function Philosophy() {
	const [brand, { total }, categories, collections] = await Promise.all([
		getStoreBrand(),
		getHomeProducts(),
		getCategoryTiles(),
		getCollectionTiles(),
	]);
	const stats = [
		{ num: String(total), label: total === 1 ? "Product" : "Products" },
		{ num: String(categories.length), label: categories.length === 1 ? "Category" : "Categories" },
		{ num: String(collections.length), label: collections.length === 1 ? "Collection" : "Collections" },
	].filter((stat) => stat.num !== "0");
	const initial = brand.name.trim().charAt(0).toUpperCase() || "Y";

	return (
		<section className="relative overflow-hidden bg-earth py-20 text-cream lg:py-28">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-0 left-0 select-none font-display text-[20rem] leading-none text-cream opacity-5"
			>
				{initial}
			</div>
			<div className="relative mx-auto grid max-w-screen-xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-12">
				<div>
					<p className="mb-4 font-body text-xs uppercase tracking-widest text-gold">Our Philosophy</p>
					<h2 className="mb-6 font-display text-4xl text-cream lg:text-6xl">
						Friends worth <em>keeping</em>
					</h2>
					<p className="mb-8 font-body text-base leading-relaxed text-cream/85">
						At {brand.name}, we believe a soft toy should be hugged every day and still be loved years from
						now — soft mohair, velvet and linen, stitched faces and joints that move.
					</p>
					<Link href="/about" className={cn(btnPrimaryClass, "bg-gold text-earth hover:bg-gold-light")}>
						Read Our Story
					</Link>
				</div>
				{stats.length > 0 && (
					<dl className="grid grid-cols-3 gap-3 text-center sm:gap-4">
						{stats.map((stat) => (
							<div key={stat.label} className="flex flex-col-reverse rounded-lg bg-cream/10 px-2 py-6 sm:p-6">
								<dt className="mt-2 font-body text-2xs uppercase tracking-widest text-cream/90 sm:text-xs">
									{stat.label}
								</dt>
								<dd className="font-display text-4xl text-gold">{stat.num}</dd>
							</div>
						))}
					</dl>
				)}
			</div>
		</section>
	);
}

/** The closing call to action. */
export async function ClosingCta() {
	const brand = await getStoreBrand();
	return (
		<section className={cn(pageContainerClass, "pb-32 text-center")}>
			<p className={eyebrowClass}>For a Little One, or a Collector</p>
			<h2 className={cn(sectionTitleClass, "mb-4")}>A Friend for Everyone</h2>
			<p className="mx-auto mb-8 max-w-xl font-body text-base leading-loose tracking-wide text-earth-soft">
				Not sure who to choose? Browse the whole family, or get in touch and tell us who the gift is for.
			</p>
			<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Link href="/products" className={btnPrimaryClass}>
					Shop All
				</Link>
				<Link
					href={brand.contact ? "/contact" : "/faq"}
					className="px-2 py-3 font-body text-xs uppercase tracking-widest text-earth-soft underline underline-offset-8 transition-colors hover:text-crimson"
				>
					{brand.contact ? "Get in Touch" : "Read the FAQ"}
				</Link>
			</div>
		</section>
	);
}
