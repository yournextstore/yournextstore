import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Sparkle } from "@/components/sparkle";
import {
	type CatalogCategory,
	type CatalogProduct,
	getCatalogCategories,
	getCatalogStats,
	getHomeProducts,
	getStoreIdentity,
} from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import heroPhoto from "@/public/images/pexels/hero-duo.jpg";
import { type TestimonialCard, TestimonialCarousel } from "./testimonial-carousel";

const numberFormat = new Intl.NumberFormat("en-US");

export async function HomeHero() {
	const [stats, identity] = await Promise.all([getCatalogStats(), getStoreIdentity()]);
	const statItems = [
		{ value: stats.products, label: "Products in Store" },
		{ value: stats.categories, label: "Categories" },
		{ value: stats.options, label: "Styles & Options" },
	].filter((item) => item.value > 0);

	return (
		<section className="overflow-hidden bg-band pt-10 md:pt-24">
			<div className="mx-auto grid grid-cols-1 md:max-w-[77.5rem] md:grid-cols-2">
				<div className="px-4">
					<h1 className="font-display mb-5 text-[2.25rem] leading-[1.05] wrap-break-word lg:mb-8 lg:text-[3.25rem] xl:text-display-xl">
						Find pieces that match your style
					</h1>
					<p className="mb-6 max-w-[545px] text-sm text-muted-foreground lg:mb-8 lg:text-base">
						{identity.storeDescription ??
							"Browse through our range of carefully made pieces, designed to bring out your individuality and suit your sense of style."}
					</p>
					<Link
						href="/products"
						className="mb-5 inline-block w-full rounded-full bg-black px-14 py-4 text-center text-base text-white transition-colors hover:bg-black/80 md:mb-12 md:w-52"
					>
						Shop Now
					</Link>
					{statItems.length > 0 && (
						<dl className="mb-8 flex flex-wrap items-stretch justify-center gap-y-3 sm:flex-nowrap md:mb-[116px] md:justify-start">
							{statItems.map((item, index) => (
								<div
									key={item.label}
									className={cn(
										"flex flex-col-reverse px-6 text-center sm:text-left md:px-0",
										index > 0 && "border-black/10 sm:border-l md:ml-6 md:pl-6 xl:ml-8 xl:pl-8",
										index === 1 && "border-l",
										index === 2 && "w-full sm:w-auto",
									)}
								>
									<dt className="text-xs text-nowrap text-muted-foreground xl:text-base">{item.label}</dt>
									<dd className="text-2xl font-bold md:text-xl lg:text-3xl xl:mb-2 xl:text-[40px] xl:leading-tight">
										{numberFormat.format(item.value)}
									</dd>
								</div>
							))}
						</dl>
					)}
				</div>
				<div className="relative min-h-[448px] md:mx-4 md:min-h-[428px]">
					<div className="absolute inset-0 overflow-hidden md:rounded-t-[40px]">
						<Image
							src={heroPhoto}
							alt=""
							fill
							priority
							placeholder="blur"
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover object-[50%_25%]"
						/>
					</div>
					<Sparkle className="star-spin absolute top-12 right-7 size-[76px] lg:size-24 xl:-right-6 xl:size-[104px]" />
					<Sparkle className="star-spin-slow absolute top-36 left-7 size-11 sm:top-64 md:top-44 md:-left-7 md:size-14 lg:top-56" />
				</div>
			</div>
		</section>
	);
}

/** The original's black band of brand logos, set here as the store's own categories. */
export async function CategoryBand() {
	const categories = (await getCatalogCategories()).slice(0, 4);
	if (categories.length === 0) return null;
	// A different "logo" treatment per name, like the original's row of brand marks.
	const treatments = [
		"font-display text-lg md:text-xl xl:text-[1.75rem]",
		"text-lg font-light tracking-[0.2em] uppercase md:text-xl xl:text-[1.75rem]",
		"text-xl font-bold italic md:text-2xl xl:text-[2rem]",
		"font-display text-lg tracking-[0.12em] md:text-xl xl:text-[1.75rem]",
	];

	return (
		<nav aria-label="Categories" className="bg-black">
			<ul className="mx-auto flex max-w-[77.5rem] flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-5 md:gap-x-12 md:py-8 xl:flex-nowrap xl:justify-between xl:px-0 xl:py-0">
				{categories.map((category, index) => (
					<li key={category.slug}>
						<Link
							href={`/category/${category.slug}`}
							className={cn(
								"block py-2 whitespace-nowrap text-white transition-opacity hover:opacity-70 xl:py-11",
								treatments[index % treatments.length],
							)}
						>
							{category.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export async function ProductRow({
	title,
	products,
	viewAllHref,
	priority = false,
}: {
	title: string;
	products: CatalogProduct[];
	viewAllHref?: string;
	priority?: boolean;
}) {
	if (products.length === 0) return null;

	return (
		<section className="mx-auto max-w-[77.5rem] text-center">
			<h2 className="font-display mb-8 px-4 text-display-sm md:mb-14 md:text-display-lg">{title}</h2>
			<ul className="no-scrollbar mb-6 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 text-left sm:gap-5 md:mb-9 xl:scroll-px-0 xl:px-0">
				{products.map((product, index) => (
					<li
						key={product.id}
						className="w-[198px] shrink-0 snap-start sm:w-[295px] xl:w-[calc((100%-3.75rem)/4)]"
					>
						<ProductCard product={product} priority={priority && index < 2} />
					</li>
				))}
			</ul>
			{viewAllHref && (
				<div className="px-4 sm:px-0">
					<Link
						href={viewAllHref}
						className="inline-block w-full rounded-full border border-black/10 px-[54px] py-4 text-sm font-medium transition-colors hover:bg-black hover:text-white sm:w-[218px] sm:text-base"
					>
						View All
					</Link>
				</div>
			)}
		</section>
	);
}

export async function HomeProductRows() {
	const { arrivals, picks } = await getHomeProducts();
	return (
		<>
			<ProductRow title="New Arrivals" products={arrivals} viewAllHref="/products" priority />
			{picks.length > 0 && (
				<div className="frame">
					<hr className="my-10 border-black/10 sm:my-16" />
				</div>
			)}
			<div className="mb-[50px] sm:mb-20">
				<ProductRow title="Top Picks" products={picks} viewAllHref="/products?sort=price-desc" />
			</div>
		</>
	);
}

function CategoryCard({
	category,
	wide,
	priority,
}: {
	category: CatalogCategory;
	wide: boolean;
	priority: boolean;
}) {
	return (
		<Link
			href={`/category/${category.slug}`}
			className={cn(
				"group relative isolate block h-[190px] w-full overflow-hidden rounded-[20px] bg-white md:h-full",
				wide ? "md:flex-[684]" : "md:flex-[407]",
			)}
		>
			{category.image && (
				<div className={cn("absolute inset-y-0 right-0 -z-10 w-1/2", wide ? "md:w-[68%]" : "md:w-[58%]")}>
					<YNSMedia
						src={category.image}
						alt=""
						fill
						priority={priority}
						sizes="(max-width: 768px) 70vw, 480px"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent" />
				</div>
			)}
			<span className="capitalize-first absolute top-4 left-6 block max-w-[45%] text-left text-2xl leading-tight font-bold md:top-[25px] md:left-9 md:text-4xl">
				{category.name}
			</span>
		</Link>
	);
}

/** "Browse by dress style": the grey bento of four cards, one per category. */
export async function CategoryBento() {
	const categories = (await getCatalogCategories()).filter((category) => category.image).slice(0, 4);
	if (categories.length < 2) return null;
	const rows = [categories.slice(0, 2), categories.slice(2, 4)].filter((row) => row.length > 0);

	return (
		<div className="mb-[50px] px-4 sm:mb-20 xl:px-0">
			<section className="mx-auto max-w-[77.5rem] rounded-[40px] bg-pill px-6 pt-10 pb-6 text-center md:p-[70px]">
				<h2 className="font-display mb-8 text-display-sm md:mb-14 md:text-display-lg">Browse by category</h2>
				<div className="flex flex-col gap-4 sm:gap-5">
					{rows.map((row, rowIndex) => (
						<div
							key={row.map((category) => category.slug).join()}
							className="flex flex-col gap-4 sm:flex-row sm:gap-5 md:h-[289px]"
						>
							{row.map((category, index) => (
								<CategoryCard
									key={category.slug}
									category={category}
									priority={false}
									wide={row.length === 1 || (rowIndex % 2 === 0 ? index === 1 : index === 0)}
								/>
							))}
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

// Real reviews when the store collects them; the original's quotes are invented, so never fake them.
async function getHomeReviews(): Promise<TestimonialCard[]> {
	"use cache";
	cacheLife("hours");
	const identity = await getStoreIdentity();
	if (!identity.reviewsEnabled) return [];
	const { picks, arrivals } = await getHomeProducts();
	const results = await Promise.all(
		[...picks, ...arrivals]
			.slice(0, 6)
			.map((product) =>
				commerce.productReviewsBrowse({ idOrSlug: product.slug }, { limit: 4 }).catch(() => null),
			),
	);
	return results
		.flatMap((result) => result?.data ?? [])
		.filter((review) => review.rating >= 4 && review.content)
		.slice(0, 8)
		.map((review) => ({ id: review.id, title: review.author, body: review.content, rating: review.rating }));
}

export async function HomeTestimonials() {
	const [reviews, stats] = await Promise.all([getHomeReviews(), getCatalogStats()]);
	if (reviews.length >= 3) {
		return <TestimonialCarousel title="Our happy customers" cards={reviews} />;
	}
	const promises: TestimonialCard[] = [
		{
			id: "checkout",
			title: "Secure checkout",
			body: "Pay with cards, wallets and local methods through an encrypted checkout. Your details never touch this page.",
		},
		{
			id: "catalog",
			title: "A range to explore",
			body: `${numberFormat.format(stats.products)} products to browse, filter and compare, each with its own page of details and photos.`,
		},
		{
			id: "account",
			title: "Orders in one place",
			body: "Sign in with just your email to follow every order, see its status and find past purchases in seconds.",
		},
		{
			id: "people",
			title: "Real people behind it",
			body: "Questions about a size, a colour or caring for a piece? We are happy to help before and after your order.",
		},
		{
			id: "gift",
			title: "Ready to give",
			body: "Many pieces make easy gifts. Add a few to your cart and send them straight to someone you love.",
		},
	];
	return <TestimonialCarousel title="Why shop with us" cards={promises} />;
}
