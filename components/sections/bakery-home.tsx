import { BookOpen, Mail, Search, UserRound } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/bakery/arrow";
import { SectionHeader } from "@/components/bakery/section-header";
import { Separator } from "@/components/bakery/separator";
import { ShowMoreGroup } from "@/components/bakery/show-more";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	type CatalogProduct,
	firstStill,
	getCatalogProducts,
	getFeaturedProducts,
	getGalleryProducts,
	getMenuCategories,
	getStoreBrand,
	LIFESTYLE,
} from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { BODY_COPY, buttonClass } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Splits a list into three columns the way the original's gallery data is laid out. */
const intoColumns = <T,>(items: T[]) => [items.slice(0, 3), items.slice(3, 6), items.slice(6, 9)];

export async function BakeryHero() {
	"use cache";
	cacheLife("minutes");
	const hero = LIFESTYLE.hero;

	return (
		<section className="bake-container flex flex-col-reverse gap-6 lg:flex-row lg:gap-0 lg:pt-36 lg:pb-24">
			<div className="flex flex-col gap-3 lg:max-w-md lg:gap-8 xl:max-w-[40rem]">
				<h1 className="font-serif text-heading-4xl font-bold lg:text-heading-5xl xl:text-heading-6xl">
					Where Every Crumb Tells a Little Story
				</h1>
				<p className="font-sans text-body-md text-muted-foreground lg:text-body-lg xl:text-body-xl">
					Step into our bakehouse, where every bite is a small delight! Slow-fermented breads, butter pastries
					and cookies, boxed up for your table.
				</p>
				<Link href="/products" className={buttonClass({ className: "mt-3 lg:mt-1.5 lg:w-fit xl:mt-2" })}>
					<span>Get a taste</span>
					<Arrow />
				</Link>
			</div>
			<div className="blob-shadow relative aspect-video flex-1 overflow-hidden rounded-md lg:aspect-auto lg:overflow-visible">
				{hero ? (
					<div className="blob-mask pointer-events-none absolute top-1/2 aspect-square w-full -translate-y-1/2 lg:right-0 lg:max-w-md xl:max-w-lg">
						<Image
							src={hero.src}
							alt=""
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 512px"
							className="object-cover"
						/>
					</div>
				) : null}
			</div>
		</section>
	);
}

export async function FeaturedDelights() {
	const { products } = await getFeaturedProducts(3);
	if (products.length === 0) return null;
	return <ProductGrid products={products} />;
}

export async function WelcomeBand() {
	"use cache";
	cacheLife("minutes");
	const brand = await getStoreBrand();
	const image = LIFESTYLE.welcome;

	return (
		<>
			<Separator />
			<section className="bg-surface py-16 lg:py-24">
				<div className="bake-container flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
					<div className="relative aspect-video flex-1 overflow-hidden rounded-md shadow-soft lg:aspect-[4/3]">
						<Image
							src={image.src}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 576px"
							className="object-cover"
						/>
					</div>
					<div className="flex flex-1 flex-col gap-3 lg:gap-4">
						<h2 className="font-serif text-heading-2xl font-bold lg:text-heading-3xl xl:text-heading-4xl">
							Welcome to {brand.name}
						</h2>
						<p className={cn(BODY_COPY, "xl:text-body-xl")}>
							At {brand.name}, we&apos;re all about small, delightful moments: a warm loaf on the table, a
							croissant with the morning coffee, a tin of cookies worth sharing with loved ones. Our dough
							takes its time, and so can you. Welcome to our bakehouse.
						</p>
						<Link href="/about" className={buttonClass({ className: "mt-2.5 lg:mt-2 lg:w-fit" })}>
							<span>More about us</span>
							<Arrow />
						</Link>
					</div>
				</div>
			</section>
			<Separator flip />
		</>
	);
}

const GALLERY_ITEM_IMAGE =
	"relative w-full overflow-hidden border-b-2 border-background shadow-soft lg:rounded-md lg:border-none";

function GalleryTile({
	product,
	className,
	index,
}: {
	product: CatalogProduct;
	className: string;
	index: number;
}) {
	const src = firstStill(product.images);
	return (
		<Link href={`/product/${product.slug}`} className="group/tile block focus-visible:outline-none">
			<span className={cn(GALLERY_ITEM_IMAGE, "block", className)}>
				{src ? (
					<YNSMedia
						src={src}
						alt={product.name}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 384px"
						className="object-cover transition-transform duration-500 group-hover/tile:scale-[1.03]"
						loading={index < 3 ? "eager" : "lazy"}
					/>
				) : null}
				<span className="absolute inset-0 rounded-md ring-brand-hover ring-inset group-focus-visible/tile:ring-3" />
			</span>
		</Link>
	);
}

/**
 * The original's "Pastry Portraits" gallery: three columns of photographs (portrait, square, portrait), the third row
 * veiled until "Show more". The collapse rules are the original's, item for item.
 */
export async function PastryPortraits() {
	"use cache";
	cacheLife("minutes");
	const products = await getGalleryProducts(9);
	if (products.length < 3) return null;
	const [first = [], second = [], third = []] = intoColumns(products);

	return (
		<section className="bake-container flex flex-col gap-8 py-16 lg:gap-16 lg:py-24">
			<SectionHeader title="Picture Perfect" subtitle="A closer look at what comes out of our ovens" />
			<ShowMoreGroup className="-mx-6 flex flex-col sm:mx-0 lg:flex-row lg:gap-8">
				<ul className="flex flex-1 flex-col lg:gap-8">
					{first.map((product, index) => (
						<li
							key={product.id}
							className="group/item max-lg:group-data-[show-more=false]:[&:nth-child(n+4)]:hidden lg:group-data-[show-more=false]:[&:nth-child(n+3)]:hidden"
						>
							<GalleryTile
								product={product}
								index={index}
								className="aspect-[3/4] lg:group-even/item:aspect-square"
							/>
						</li>
					))}
				</ul>
				<ul className="flex flex-1 flex-col lg:gap-8">
					{second.map((product, index) => (
						<li
							key={product.id}
							className="max-lg:group-data-[show-more=false]:[&:nth-child(n+2)]:hidden lg:group-data-[show-more=false]:[&:nth-child(n+3)]:hidden"
						>
							<GalleryTile product={product} index={index + 3} className="aspect-[3/4] lg:aspect-[0.818/1]" />
						</li>
					))}
				</ul>
				{third.length > 0 ? (
					<ul className="flex flex-1 flex-col max-lg:group-data-[show-more=false]:hidden lg:gap-8">
						{third.map((product, index) => (
							<li
								key={product.id}
								className="group/item lg:group-data-[show-more=false]:[&:nth-child(n+3)]:hidden"
							>
								<GalleryTile
									product={product}
									index={index + 6}
									className="aspect-[3/4] group-last/item:border-none lg:group-even/item:aspect-square"
								/>
							</li>
						))}
					</ul>
				) : null}
			</ShowMoreGroup>
		</section>
	);
}

/**
 * Replaces the original's "Opening Hours" (the store has none on record): the shop's top-level
 * categories as the same ruled rows, each with its count.
 */
export async function MenuAtAGlance() {
	"use cache";
	cacheLife("minutes");
	const categories = await getMenuCategories();
	if (categories.length === 0) return null;
	const image = LIFESTYLE.glance;

	return (
		<>
			<Separator />
			<section className="bg-surface py-16 lg:py-24">
				<div className="bake-container flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-16">
					<div className="relative aspect-video flex-1 overflow-hidden rounded-md shadow-soft lg:aspect-[4/3]">
						<Image
							src={image.src}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 576px"
							className="object-cover"
						/>
					</div>
					<div className="flex flex-1 flex-col gap-2 lg:gap-4">
						<h2 className="font-serif text-heading-2xl font-bold lg:text-heading-3xl xl:text-heading-4xl">
							The Shop at a Glance
						</h2>
						<ul className="font-sans text-body-md text-muted-foreground xl:text-body-lg">
							{categories.map((category) => (
								<li key={category.slug} className="border-b border-line last:border-none">
									<Link
										href={`/category/${category.slug}`}
										className="flex justify-between gap-4 py-3 hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
									>
										<span>{category.name}</span>
										<span className="tabular-nums">
											{category.count} {category.count === 1 ? "item" : "items"}
										</span>
									</Link>
								</li>
							))}
						</ul>
						<Link href="/products" className={buttonClass({ className: "mt-1 lg:mt-1 lg:w-fit" })}>
							<span>Browse the shop</span>
							<Arrow />
						</Link>
					</div>
				</div>
			</section>
			<Separator flip />
		</>
	);
}

async function getCounterNotes() {
	"use cache";
	cacheLife("minutes");
	const [products, gallery, featured] = await Promise.all([
		getCatalogProducts(),
		getGalleryProducts(9),
		getFeaturedProducts(3),
	]);
	const used = new Set([...gallery, ...featured.products].map((product) => product.id));
	const withCopy = products.filter((product) => firstStill(product.images) && product.summary?.trim());
	const fresh = withCopy.filter((product) => !used.has(product.id));
	return [...fresh, ...withCopy.filter((product) => used.has(product.id))].slice(0, 9);
}

function CounterNote({
	product,
	price,
	className,
}: {
	product: CatalogProduct;
	price: string | null;
	className?: string;
}) {
	const src = firstStill(product.images);
	return (
		<figure
			className={cn(
				"flex flex-col gap-4 border-line-soft p-6 lg:h-fit lg:gap-6 lg:rounded-md lg:border lg:bg-surface lg:p-8 lg:shadow-soft",
				className,
			)}
		>
			<figcaption className="flex items-center gap-4 lg:gap-6">
				<span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-soft lg:h-16 lg:w-16">
					{src ? <YNSMedia src={src} alt="" fill sizes="64px" className="object-cover" /> : null}
				</span>
				<span className="min-w-0 space-y-0.5 lg:space-y-1">
					<Link
						href={`/product/${product.slug}`}
						className="block font-serif text-heading-xl font-bold text-brand not-italic hover:text-brand-hover hover:underline"
					>
						{product.name}
					</Link>
					{price ? <span className="block font-sans text-body-sm font-bold text-fill">{price}</span> : null}
				</span>
			</figcaption>
			<blockquote className="line-clamp-6 font-sans text-body-md text-muted-foreground">
				{product.summary?.trim()}
			</blockquote>
		</figure>
	);
}

/**
 * Replaces the original's testimonials (invented customers are not something a real store can
 * ship): the same three-column cards, each a product's own note from the menu.
 */
export async function FromTheCounter() {
	const [notes, { currency, locale, taxBehavior }] = await Promise.all([getCounterNotes(), getStoreConfig()]);
	if (notes.length < 3) return null;
	const priceOf = (product: CatalogProduct) => {
		// A free set/bundle shell (price "0") shows no price rather than "$0.00".
		const variant = product.variants.find((v) => Number(v.price) > 0);
		return variant
			? formatMoney({ amount: BigInt(displayPrice(variant, taxBehavior)), currency, locale })
			: null;
	};
	const [first = [], second = [], third = []] = intoColumns(notes);

	return (
		<section className="bake-container flex flex-col gap-8 py-16 lg:gap-16 lg:py-24">
			<SectionHeader
				title="From the Counter"
				subtitle="A closer look at a few favourites, in their own words"
			/>
			<ShowMoreGroup className="-mx-6 flex flex-col divide-y divide-line sm:mx-0 lg:flex-row lg:gap-8 lg:divide-none">
				<ul className="flex flex-1 flex-col divide-y divide-line lg:gap-8 lg:divide-none">
					{first.map((product) => (
						<li
							key={product.id}
							className="group/item max-lg:group-data-[show-more=false]:[&:nth-child(n+4)]:hidden lg:group-data-[show-more=false]:[&:nth-child(n+3)]:hidden"
						>
							<CounterNote
								product={product}
								price={priceOf(product)}
								className="group-first/item:pt-0 lg:group-first/item:pt-8"
							/>
						</li>
					))}
				</ul>
				<ul className="flex flex-1 flex-col divide-y divide-line lg:gap-8 lg:divide-none">
					{second.map((product) => (
						<li
							key={product.id}
							className="max-lg:group-data-[show-more=false]:[&:nth-child(n+2)]:hidden lg:group-data-[show-more=false]:[&:nth-child(n+3)]:hidden"
						>
							<CounterNote product={product} price={priceOf(product)} />
						</li>
					))}
				</ul>
				{third.length > 0 ? (
					<ul className="flex flex-1 flex-col divide-y divide-line group-data-[show-more=false]:hidden lg:gap-8 lg:divide-none lg:group-data-[show-more=false]:flex">
						{third.map((product) => (
							<li
								key={product.id}
								className="group/item lg:group-data-[show-more=false]:[&:nth-child(n+3)]:hidden"
							>
								<CounterNote
									product={product}
									price={priceOf(product)}
									className="group-last/item:pb-0 lg:group-last/item:pb-8"
								/>
							</li>
						))}
					</ul>
				) : null}
			</ShowMoreGroup>
		</section>
	);
}

const FIELD_LABEL = "font-serif text-heading-xl font-bold text-brand";
const FIELD_CONTROL =
	"h-14 w-full rounded-md border border-line bg-surface px-3 font-sans text-body-md text-foreground placeholder:text-muted-foreground focus-visible:border-brand-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-hover";

async function getFinderData() {
	"use cache";
	cacheLife("minutes");
	const [categories, brand, socials] = await Promise.all([
		getMenuCategories(),
		getStoreBrand(),
		commerce.socialsGet().catch(() => null),
	]);
	return { categories, brand, email: socials?.socials.email ?? null };
}

/**
 * The original's "Get in Touch" band: heading on cream, a zigzag into sand, contact lines with
 * teal icons on the left and a raised form card on the right. The form searches the shop.
 */
export async function MenuFinder() {
	const { categories, brand, email } = await getFinderData();
	const lines = [
		{ href: "/products", label: "Browse the full shop", icon: BookOpen, external: false },
		{ href: "/account", label: "Track an order in your account", icon: UserRound, external: true },
		...(brand.contact ? [{ href: "/contact", label: "Send us a message", icon: Mail, external: false }] : []),
		...(email ? [{ href: `mailto:${email}`, label: email, icon: Mail, external: true }] : []),
	];

	return (
		<section>
			<div className="py-8 lg:pt-24">
				<div className="bake-container">
					<SectionHeader
						center={false}
						title="Looking for Something?"
						subtitle="Search the shop, or narrow it down to a category"
					/>
				</div>
			</div>
			<Separator />
			<div className="bg-surface">
				<div className="flex flex-col lg:bake-container lg:flex-row lg:gap-16">
					<ul className="bake-container flex-1 space-y-3 py-8 lg:mx-0 lg:max-w-none lg:px-0 lg:pb-24">
						{lines.map((line) => {
							const content = (
								<>
									<line.icon aria-hidden="true" className="h-5 w-5 shrink-0 text-fill" />
									<span className="font-sans text-body-md text-muted-foreground group-hover:text-foreground group-hover:underline group-focus-visible:text-foreground group-focus-visible:underline">
										{line.label}
									</span>
								</>
							);
							return (
								<li key={line.href} className="w-fit">
									{line.external ? (
										<a href={line.href} className="group flex items-center gap-2 lg:gap-3">
											{content}
										</a>
									) : (
										<Link href={line.href} className="group flex items-center gap-2 lg:gap-3">
											{content}
										</Link>
									)}
								</li>
							);
						})}
					</ul>
					<Separator flip className="lg:hidden" />
					<div className="bg-background lg:flex-1 lg:bg-surface">
						<form
							action="/search"
							method="get"
							className="bake-container relative grid h-fit grid-cols-1 gap-6 border-line-soft bg-background px-6 py-8 lg:mx-0 lg:-mt-[11.1875rem] lg:max-w-none lg:rounded-md lg:border lg:px-8 lg:shadow-soft xl:grid-cols-2"
						>
							<div className="flex flex-col gap-2">
								<label htmlFor="finder-q" className={FIELD_LABEL}>
									Looking for
								</label>
								<input
									id="finder-q"
									name="q"
									type="search"
									required
									placeholder="What would you like?"
									className={FIELD_CONTROL}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label htmlFor="finder-category" className={FIELD_LABEL}>
									Category
								</label>
								<select id="finder-category" name="category" defaultValue="" className={FIELD_CONTROL}>
									<option value="">Anything</option>
									{categories.map((category) => (
										<option key={category.slug} value={category.slug}>
											{category.name}
										</option>
									))}
								</select>
							</div>
							<button type="submit" className={buttonClass({ className: "my-1 xl:col-span-2" })}>
								<Search aria-hidden="true" className="h-5 w-5" />
								<span>Search the shop</span>
							</button>
						</form>
					</div>
				</div>
			</div>
			<Separator className="lg:hidden" />
		</section>
	);
}
