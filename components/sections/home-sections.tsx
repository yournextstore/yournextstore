import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ArrowUpRight, HeroStar, HeroWedge } from "@/components/shapes";
import { getHomeProducts } from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";
import { YNSMedia } from "@/lib/yns-media";

export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
	return (
		<h2 id={id} className="font-title mb-[45px] text-center text-sp-3 md:text-sp-3-md">
			{children}
		</h2>
	);
}

/** Lilac hero: eyebrow, two-line headline, copy and an outlined button beside a square photograph. */
export function Hero() {
	return (
		<section
			data-band
			className="relative overflow-x-clip bg-lilac pt-[45px] pb-[75px] md:pt-[115px] md:pb-[130px] sp-lg:pt-[106px]"
		>
			<div className="sp-container grid gap-[50px] sp-xl:grid-cols-2 sp-xl:items-center">
				<div>
					<p className="font-title text-sp-4 tracking-normal md:text-sp-4-md">Just landed</p>
					<h1 className="font-title mt-4 mb-[30px] text-sp-2 md:text-sp-2-md sp-2xl:text-sp-2-2xl">
						New season <br />
						collection
					</h1>
					<p className="mb-4 text-sp-8 leading-[2.1] md:text-[1.375rem] md:leading-[1.8]">
						Statement pieces and everyday staples picked to stand out. New styles land all the time, so find
						yours before it is gone
					</p>
					<Link href="/products" className="btn-brut md:mt-[50px]">
						<span>Shop now</span>
						<ArrowUpRight className="size-5" />
					</Link>
				</div>

				<div className="relative z-1 mx-auto w-full max-w-[704px]">
					<HeroStar className="absolute -top-[140px] -left-[120px] -z-1 hidden sp-xl:block" />
					<Link href="/products" className="block" tabIndex={-1} aria-hidden="true">
						<figure className="relative aspect-[704/700] overflow-hidden bg-gainsboro">
							<YNSMedia
								src={EDITORIAL.hero.src}
								alt=""
								fill
								priority
								sizes="(max-width: 575px) 100vw, (max-width: 1199px) 704px, 50vw"
								className="object-cover object-[50%_20%]"
							/>
						</figure>
					</Link>
				</div>
			</div>
			<HeroWedge className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 sp-xl:block" />
		</section>
	);
}

/** "Explore new arrivals": a scroll-snapping rail, one card per view on phones, three on desktop. */
export async function NewArrivals() {
	const { arrivals } = await getHomeProducts();
	if (arrivals.length === 0) return null;

	return (
		<section aria-labelledby="arrivals-title" className="py-[75px] md:py-[150px]">
			<div className="sp-container">
				<SectionTitle id="arrivals-title">Explore new arrivals</SectionTitle>
				<ul className="snap-rail">
					{arrivals.map((product) => (
						<li key={product.id}>
							<ProductCard product={product} size="rail" />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** "Featured products": the three-column grid and its orange "View all" button. */
export async function FeaturedProducts() {
	const { featured } = await getHomeProducts();
	if (featured.length === 0) return null;

	return (
		<section aria-labelledby="featured-title" className="pb-[75px] md:pb-[150px]">
			<div className="sp-container">
				<SectionTitle id="featured-title">Featured products</SectionTitle>
				<ul className="mb-[60px] grid gap-x-6 gap-y-[60px] md:grid-cols-2 sp-xl:grid-cols-3">
					{featured.map((product) => (
						<li key={product.id}>
							<ProductCard product={product} />
						</li>
					))}
				</ul>
				<div className="flex justify-center">
					<Link href="/products" className="btn-brut btn-orange">
						View all products
					</Link>
				</div>
			</div>
		</section>
	);
}

/** The offer band: a full-bleed photograph with a white, hard-shadowed card on the left. */
export function OfferBand() {
	return (
		<section aria-labelledby="offer-title" className="relative bg-gainsboro py-[100px] sp-xl:py-[200px]">
			<YNSMedia
				src={EDITORIAL.offer.src}
				alt=""
				fill
				sizes="100vw"
				className="object-cover object-right sp-xl:object-center"
			/>
			<div className="sp-container relative">
				<div className="border-2 border-ink bg-background px-[30px] py-20 shadow-brut sp-sm:px-[50px] md:px-[90px] sp-xl:w-[40%]">
					<h2 id="offer-title" className="font-title text-sp-1 leading-none">
						Fresh drops
					</h2>
					<p className="mt-5 mb-[45px] text-sp-8 leading-[1.8]">
						New pieces keep arriving and favourites go fast. Catch them while they last.
					</p>
					<Link href="/products" className="btn-brut btn-orange">
						<span>Shop now</span>
						<ArrowUpRight className="size-5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
