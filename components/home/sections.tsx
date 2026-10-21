import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product-card";
import { getCollectionTiles, getHeroSlides, getHomeProducts } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export async function HomeHero() {
	const slides = await getHeroSlides();
	if (slides.length === 0) return null;
	return (
		<section>
			<div className="shell">
				<div className="cp-gradient rounded-md py-10">
					<HeroSlider slides={slides} />
				</div>
			</div>
		</section>
	);
}

export async function HomeCollections() {
	const tiles = await getCollectionTiles();
	return (
		<section className="section">
			<div className="shell">
				<div className="mb-6 text-center md:mb-14">
					<h2 className="cp-h2">Collections</h2>
				</div>
				<div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] sm:gap-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
					{tiles.map((tile) => (
						<div
							key={tile.href + tile.title}
							className="relative w-[calc(50%-5px)] shrink-0 snap-start text-center sm:w-[calc(50%-10px)] md:w-auto"
						>
							<div className="relative h-[150px] overflow-hidden rounded-md bg-light md:h-[250px] lg:h-[306px]">
								{tile.image ? (
									<YNSMedia
										src={tile.image}
										alt=""
										fill
										sizes="(max-width: 768px) 50vw, 424px"
										className="object-cover"
									/>
								) : null}
							</div>
							<div className="py-6">
								<h3 className="cp-h4 mb-2 font-medium">
									<Link href={tile.href} className="after:absolute after:inset-0">
										{tile.title}
									</Link>
								</h3>
								<p className="text-xs text-soft-text md:text-xl">
									{tile.count > 0
										? `${tile.count} ${tile.count === 1 ? "item" : "items"}`
										: "View collection"}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export async function HomeFeatured() {
	const products = (await getHomeProducts()).slice(0, 4);
	if (products.length === 0) return null;
	return (
		<section>
			<div className="shell">
				<div className="mb-6 text-center md:mb-14">
					<h2 className="cp-h2 mb-2">Featured Products</h2>
					<p className="md:text-cp-h5">Explore today&apos;s featured picks!</p>
				</div>
				<div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
					{products.map((product, index) => (
						<ProductCard key={product.id} product={product} compact priority={index < 2} />
					))}
				</div>
				<div className="mt-8 flex justify-center md:mt-14">
					<Link href="/products" className="cp-btn cp-btn-sm md:cp-btn-lg font-medium">
						+ See All Products
					</Link>
				</div>
			</div>
		</section>
	);
}

/** The original's grey "Deal of the Week" banner, as a store pick with no invented discount. */
export async function HomeCallToAction() {
	const [products, slides] = await Promise.all([getHomeProducts(), getHeroSlides()]);
	const taken = new Set([
		...products.slice(0, 4).map((p) => `/product/${p.slug}`),
		...slides.map((s) => s.href),
	]);
	const pick =
		products.find(
			(product) =>
				!taken.has(`/product/${product.slug}`) &&
				product.images[0] &&
				product.variants.some((variant) => Number(variant.price) > 0),
		) ?? products[0];
	if (!pick?.images[0]) return null;
	return (
		<section className="section">
			<div className="shell">
				<div className="rounded-xl bg-light px-6 py-8 md:py-16">
					<div className="flex flex-col items-center lg:flex-row">
						<div className="order-2 mx-auto mb-10 text-center md:mb-0 lg:order-none lg:w-1/2">
							<p className="font-bold text-ink md:text-lg">Pick of the Week</p>
							<h2 className="cp-h1 my-2">{pick.name}</h2>
							{pick.summary ? <p className="mx-auto mb-6 max-w-lg md:text-lg">{pick.summary}</p> : null}
							<Link href={`/product/${pick.slug}`} className="cp-btn cp-btn-sm md:cp-btn-lg">
								Shop Now
							</Link>
						</div>
						<div className="mx-auto mb-6 w-full max-w-[543px] lg:mb-0 lg:w-5/12">
							<div className="relative aspect-[543/390] mix-blend-multiply dark:mix-blend-normal">
								<YNSMedia
									src={pick.images[0]}
									alt=""
									fill
									sizes="(max-width: 1024px) 90vw, 543px"
									className="cp-cutout object-contain [mask-image:radial-gradient(closest-side,#000_72%,transparent)]"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
