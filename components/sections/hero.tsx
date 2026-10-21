import { ShoppingCart } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getMenuCategories, getStoreIdentity } from "@/lib/catalog";
import heroImage from "@/public/images/pexels/hero-hoodie-studio.jpg";

async function getHeroData() {
	"use cache";
	cacheLife("minutes");
	const [categories, identity] = await Promise.all([getMenuCategories(), getStoreIdentity()]);
	return {
		categories: categories.slice(0, 4),
		description: identity.storeDescription,
	};
}

/**
 * The original's split hero: violet chip, bold headline, black button and a row of grey
 * wordmarks on the left; a model rising out of a peach circle on the right. The wordmarks
 * (press logos there) become the store's own categories, the cut-out model a studio photograph
 * in an arch that echoes the circle.
 */
export async function Hero() {
	const { categories, description } = await getHeroData();

	return (
		<section className="overflow-hidden bg-surface">
			<div className="mx-auto flex max-w-7xl flex-col px-4 md:min-h-[min(80vh,46rem)] md:flex-row">
				<div className="flex flex-1 flex-col items-center justify-center pt-10 md:items-start md:px-4 md:py-16">
					<span className="mb-2.5 rounded-md bg-violet-soft px-4 py-1 text-sm font-semibold text-violet md:mb-5">
						New arrivals
					</span>
					<h1 className="mb-5 text-balance text-center text-kara-hero font-bold text-black md:text-left md:text-kara-hero-lg">
						A Considered Take on Everyday Style
					</h1>
					<p className="mb-5 max-w-xl text-center text-lg leading-tight text-neutral-700 md:mb-10 md:text-left">
						{description ??
							"Anyone can follow a trend, but the pieces you keep are the ones made well enough to last for years."}
					</p>
					<Link
						href="/products"
						className="mb-10 flex items-center gap-2 rounded bg-zinc-900 px-8 py-2.5 text-base text-white shadow-sm shadow-zinc-500 transition hover:bg-zinc-700"
					>
						<ShoppingCart className="h-4 w-4" aria-hidden="true" />
						Start Shopping
					</Link>
					{categories.length > 0 && (
						<ul className="mb-5 flex w-full flex-wrap justify-center gap-x-8 gap-y-3 md:justify-between">
							{categories.map((category, index) => (
								<li key={category.slug}>
									<Link
										href={`/category/${category.slug}`}
										className={
											index % 2 === 0
												? "font-serif text-xl uppercase tracking-[0.12em] text-neutral-600 transition hover:text-neutral-900"
												: "text-xl font-bold lowercase italic tracking-tight text-neutral-600 transition hover:text-neutral-900"
										}
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="relative flex flex-1 items-end justify-center pt-6 md:pt-12">
					<div
						aria-hidden="true"
						className="absolute left-1/2 top-[8%] aspect-square w-[92%] max-w-[34rem] -translate-x-1/2 rounded-full bg-peach md:top-1/2 md:-translate-y-[45%]"
					/>
					<div className="relative aspect-[2/3] w-[62%] max-w-[22rem] overflow-hidden rounded-t-full">
						<Image
							src={heroImage}
							alt=""
							fill
							priority
							placeholder="blur"
							sizes="(max-width: 768px) 62vw, 22rem"
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
