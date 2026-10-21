import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { picturedFirst } from "@/lib/pictured";

async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const [featured, newest] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] })),
		commerce
			.productBrowse({ active: true, limit: 10, orderBy: "createdAt", orderDirection: "desc" })
			.catch(() => ({ data: [] })),
	]);
	// Pictured products lead both rails, so neither opens on an empty image well.
	return { featured: picturedFirst(featured.data).slice(0, 6), newest: picturedFirst(newest.data) };
}

/** Soul's "Featured collection": a sticky heading column (a third) beside a product grid. */
export async function FeaturedProducts() {
	const { featured } = await getHomeProducts();
	if (featured.length === 0) return null;

	return (
		<section className="container-soul flex flex-col items-stretch gap-x-16 gap-y-10 py-10 sm:py-14 lg:flex-row lg:py-20">
			<div className="min-w-0 lg:w-1/3">
				<div className="sticky top-24">
					<h2 className="mb-3 text-4xl leading-none lg:text-5xl">Featured collection</h2>
					<p className="mb-8 max-w-xl text-lg leading-normal text-contrast-500">
						Explore our top picks in this featured collection. Find the perfect gift or treat yourself!
					</p>
					<Link href="/products" className="btn-soul btn-secondary min-h-14 px-6 py-4 text-base">
						View more
					</Link>
				</div>
			</div>
			<div className="min-w-0 lg:w-2/3">
				<ProductGrid products={featured} className="xl:grid-cols-3" priorityCount={0} />
			</div>
		</section>
	);
}

/** Soul's "New arrivals": heading with an underline link, then the product carousel. */
export async function NewArrivals() {
	const { newest } = await getHomeProducts();
	if (newest.length === 0) return null;

	return (
		<section className="container-soul overflow-hidden py-10 sm:py-14 lg:py-20">
			<div className="mb-6 flex w-full flex-row flex-wrap items-end justify-between gap-x-8 gap-y-6 lg:mb-8">
				<div>
					<h2 className="text-2xl leading-none sm:text-3xl lg:text-4xl">New arrivals</h2>
					<p className="mt-3 max-w-xl leading-relaxed text-contrast-500">
						Our latest products are here. Check out what's new in store.
					</p>
				</div>
				<Link
					href="/products?sort=newest"
					className="group mr-3 rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
				>
					<span className="link-underline">See all</span>
				</Link>
			</div>
			<ProductCarousel label="New arrivals">
				{newest.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</ProductCarousel>
		</section>
	);
}
