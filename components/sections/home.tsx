import { ArrowRightIcon, ClockIcon, GiftIcon, PackageIcon, RefreshCwIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { HeroSlider } from "@/components/sections/hero-slider";
import { Rail } from "@/components/sections/rail";
import {
	firstStill,
	getCatalogProducts,
	getCategoryTiles,
	getCollectionMembers,
	getCollectionTiles,
	getLegalLinks,
	getStoreBrand,
} from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

// Editorial photographs are bundled Pexels images (see NOTICE.md); product cards, the category
// rail and every product surface use the store's own pictures.
const PHOTO = {
	hero: ["/images/pexels/hero-bags.jpg", "/images/pexels/hero-tote.jpg"],
	bannerA: "/images/pexels/banner-sneaker.jpg",
	bannerB: "/images/pexels/banner-backpack.jpg",
	deal: "/images/pexels/deal-backpack.jpg",
};

// Zero-priced sets would print "$0.00" on a card in a merchandised row.
const priced = (product: { variants: { price: string | number }[] }) =>
	product.variants.some((variant) => Number(variant.price) > 0);

/** Everything the home page shows, read once and cached together. */
async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [brand, { products, total }, categories, collections, legal] = await Promise.all([
		getStoreBrand(),
		getCatalogProducts(),
		getCategoryTiles(),
		getCollectionTiles(),
		getLegalLinks(),
	]);
	const pictured = products.filter((p) => firstStill(p.images) && priced(p));
	// Daily Best Sells: the first collection with three products, else the newest three.
	const dealCollection = collections.find((c) => c.count >= 3) ?? null;
	const dealMembers = dealCollection ? await getCollectionMembers(dealCollection.id) : [];
	const pricedMembers = dealMembers.filter((p) => firstStill(p.images) && priced(p));
	const deals = (pricedMembers.length >= 3 ? pricedMembers : pictured).slice(0, 3);
	const topLevel = categories.filter((c) => !c.parentId);
	const banners = [...(topLevel.length >= 2 ? topLevel : categories)]
		.sort((a, b) => b.count - a.count)
		.slice(0, 2);
	return {
		brand,
		total,
		categories,
		collections,
		popular: pictured.slice(0, 10),
		deals,
		dealCollection,
		banners,
		policyHref: legal[0]?.href ?? "/faq",
	};
}

function ShopNow({
	href,
	className = "fc-btn-dark",
	label,
}: {
	href: string;
	className?: string;
	label: string;
}) {
	return (
		<Link href={href} className={`fc-btn ${className}`} aria-label={`Shop now: ${label}`}>
			Shop Now
			<ArrowRightIcon className="size-3.5" strokeWidth={2.5} aria-hidden />
		</Link>
	);
}

/** One hero slide: the copy on the left, a lifestyle photograph fading in from the right. */
function Slide({
	image,
	badge,
	heading,
	text,
	href,
	label,
	priority,
}: {
	image: string | null;
	badge: string;
	heading: React.ReactNode;
	text: string;
	href: string;
	label: string;
	priority: boolean;
}) {
	return (
		<div className="relative h-full overflow-hidden rounded-lg bg-[#ebe7e2]">
			{image ? (
				<div className="absolute inset-y-0 right-0 w-[78%] [mask-image:linear-gradient(to_right,transparent,black_38%)] md:w-[66%]">
					<YNSMedia
						src={image}
						alt=""
						fill
						priority={priority}
						sizes="(max-width: 768px) 80vw, 860px"
						className="object-cover object-center"
					/>
				</div>
			) : null}
			<div className="absolute inset-0 bg-linear-to-r from-[#ebe7e2] via-[#ebe7e2]/75 to-transparent md:hidden" />
			<div className="relative flex flex-col items-start p-8 sm:p-12 md:w-3/5 lg:py-32 lg:pl-12 xl:w-2/5">
				<span className="inline-block rounded-lg bg-sun p-2 text-fc-sm leading-none font-semibold text-gray-900">
					{badge}
				</span>
				<div className="my-7 flex flex-col gap-2">
					{heading}
					<p className="text-fc-md font-light text-gray-700">{text}</p>
				</div>
				<ShopNow href={href} label={label} />
			</div>
		</div>
	);
}

export async function HomeHero() {
	const { brand, collections } = await getHomeData();
	const first = collections[0] ?? null;
	const second = collections[1] ?? null;
	const headingClass = "text-fc-xl leading-tight font-bold text-gray-900 lg:text-fc-5xl lg:leading-tight";

	const slides = [
		<Slide
			key="new"
			image={PHOTO.hero[0] ?? null}
			badge={first ? `New in ${first.name}` : "New this week"}
			heading={<h1 className={headingClass}>New Favourites For Every Day</h1>}
			text={`Seasonal produce, fresh bakery and pantry staples from ${brand.name}, picked for the weekly shop.`}
			href={first?.href ?? "/products"}
			label={first?.name ?? "all products"}
			priority
		/>,
		<Slide
			key="shipping"
			image={PHOTO.hero[1] ?? null}
			badge={
				brand.freeShippingLabel ? `Free Shipping – orders over ${brand.freeShippingLabel}` : "Shop the range"
			}
			heading={
				brand.freeShippingLabel ? (
					<h2 className={headingClass}>
						Free Shipping on
						<br />
						orders over <span className="text-green-600">{brand.freeShippingLabel}</span>
					</h2>
				) : (
					<h2 className={headingClass}>
						Everything from <span className="text-green-600">{second?.name ?? brand.name}</span>
					</h2>
				)
			}
			text={
				brand.freeShippingLabel
					? "Delivery is on us once your basket passes the threshold, after promotions and discounts are applied."
					: `Browse the full ${brand.name} range and find something new to love.`
			}
			href={second?.href ?? "/products"}
			label={second?.name ?? "all products"}
			priority={false}
		/>,
	];

	return (
		<section className="mt-8">
			<div className="fc-container">
				<HeroSlider slides={slides} labels={["New favourites", "Free shipping"]} />
			</div>
		</section>
	);
}

export async function FeaturedCategories() {
	const { categories } = await getHomeData();
	if (categories.length === 0) return null;
	// A short rail fills the row (four or five across) instead of leaving empty slots on the right.
	const wide =
		categories.length <= 4
			? "lg:basis-[calc((100%-60px)/4)]"
			: categories.length === 5
				? "lg:basis-[calc((100%-80px)/5)]"
				: "lg:basis-[calc((100%-100px)/6)]";
	return (
		<section className="mt-8 lg:mt-12">
			<div className="fc-container">
				<Rail title="Featured Categories">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={category.href}
							className={`fc-card shrink-0 basis-full snap-start py-8 text-center transition duration-75 hover:border-green-500 hover:shadow-md hover:duration-500 xs:basis-[calc((100%-20px)/2)] md:basis-[calc((100%-40px)/3)] ${wide}`}
						>
							<span className="relative mx-auto mb-3 block size-[120px] overflow-hidden rounded-md bg-gray-50">
								{category.image ? (
									<YNSMedia src={category.image} alt="" fill sizes="120px" className="object-cover" />
								) : null}
							</span>
							<span className="block px-2 text-fc-base text-gray-600">{category.name}</span>
						</Link>
					))}
				</Rail>
			</div>
		</section>
	);
}

export async function PromoBanners() {
	const { banners } = await getHomeData();
	if (banners.length === 0) return null;
	return (
		<section className="mt-8 lg:mt-12">
			<div className="fc-container">
				<div className="flex flex-wrap gap-3 md:flex-nowrap md:gap-2 lg:gap-6">
					{banners.map((banner, index) => (
						<div key={banner.id} className="relative w-full overflow-hidden rounded-lg bg-[#f3efeb] md:w-1/2">
							<div className="absolute inset-y-0 right-0 aspect-square h-full [mask-image:linear-gradient(to_right,transparent,black_35%)]">
								<YNSMedia
									src={
										banner.image && banner.ownImage
											? banner.image
											: index % 2 === 0
												? PHOTO.bannerA
												: PHOTO.bannerB
									}
									alt=""
									fill
									sizes="240px"
									className="object-cover"
								/>
							</div>
							<div className="relative flex flex-col gap-5 px-8 py-10">
								<div className="flex flex-col gap-1">
									<h2 className="text-fc-xl font-bold">{banner.name}</h2>
									<p className="text-gray-700">
										<span className="font-bold text-gray-800">{banner.count}</span>{" "}
										{banner.count === 1 ? "product" : "products"} to choose from
									</p>
								</div>
								<div className="flex flex-wrap">
									<Link
										href={banner.href}
										className="fc-btn fc-btn-dark"
										aria-label={`Shop now: ${banner.name}`}
									>
										Shop Now
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export async function PopularProducts() {
	const { popular } = await getHomeData();
	if (popular.length === 0) return null;
	return (
		<section className="my-8 lg:my-14">
			<div className="fc-container">
				<h2 className="mb-6 text-fc-lg">Popular Products</h2>
				<div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
					{popular.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}

export async function DailyBestSells() {
	const { deals, dealCollection } = await getHomeData();
	if (deals.length === 0) return null;
	// The dark promo tile: a lifestyle photograph darkened under white type.
	const tileImage = PHOTO.deal;
	const tileHref = dealCollection?.href ?? "/products";
	return (
		<section>
			<div className="fc-container">
				<h2 className="mb-6 text-fc-lg">Daily Best Sells</h2>
				<div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-6 xl:mx-0 xl:grid xl:grid-cols-4 xl:overflow-visible xl:px-0">
					<div className="relative h-[470px] w-full shrink-0 snap-start overflow-hidden rounded-lg bg-gray-900 md:w-[310px] xl:w-auto">
						{tileImage ? (
							<YNSMedia
								src={tileImage}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 320px"
								className="object-cover"
							/>
						) : null}
						<div className="absolute inset-0 bg-linear-to-b from-gray-950/85 via-gray-950/45 to-gray-950/10" />
						<div className="relative flex flex-col gap-5 px-6 pt-8">
							<div className="flex flex-col gap-2">
								<h3 className="text-fc-lg text-white">{dealCollection?.name ?? "Our best sellers"}.</h3>
								<p className="text-white">Get the best of the shop before it sells out.</p>
							</div>
							<div>
								<ShopNow
									href={tileHref}
									className="fc-btn-green"
									label={dealCollection?.name ?? "best sellers"}
								/>
							</div>
						</div>
					</div>
					{deals.map((product) => (
						<div key={product.id} className="w-full shrink-0 snap-start md:w-[310px] xl:w-auto">
							<ProductCard product={product} layout="deal" sizes="(max-width: 768px) 100vw, 320px" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export async function FeatureRow() {
	const { total, categories, policyHref } = await getHomeData();
	const features = [
		{
			icon: ClockIcon,
			title: "Delivery to your door",
			text: "Delivery options and costs are shown at checkout, before you pay.",
		},
		{
			icon: GiftIcon,
			title: "Best Prices & Offers",
			text: "Fair everyday prices, with seasonal offers and discount codes to top it off.",
		},
		{
			icon: PackageIcon,
			title: "Wide Assortment",
			text: `Choose from ${total} products across ${categories.length} ${categories.length === 1 ? "category" : "categories"}, from everyday basics to small treats.`,
		},
	];
	return (
		<section className="my-8 lg:my-14">
			<div className="fc-container">
				<div className="-mx-3 flex flex-wrap gap-y-6">
					{features.map((feature) => (
						<div key={feature.title} className="w-full px-3 md:w-1/2 lg:w-1/4">
							<div className="flex flex-col gap-4">
								<feature.icon className="size-10 text-green-500" strokeWidth={1.5} aria-hidden />
								<div className="flex flex-col gap-2">
									<h3 className="text-fc-md">{feature.title}</h3>
									<p>{feature.text}</p>
								</div>
							</div>
						</div>
					))}
					<div className="w-full px-3 md:w-1/2 lg:w-1/4">
						<div className="flex flex-col gap-4">
							<RefreshCwIcon className="size-10 text-green-500" strokeWidth={1.5} aria-hidden />
							<div className="flex flex-col gap-2">
								<h3 className="text-fc-md">Returns</h3>
								<p>
									Questions about an order or a return? Everything is set out in our{" "}
									<Link href={policyHref} className="text-green-600 underline underline-offset-2">
										policy
									</Link>
									.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
