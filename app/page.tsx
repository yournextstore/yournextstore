import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Fragment } from "react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { picturedFirst } from "@/lib/pictured";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 48 });
	// Pictured products first; an even count keeps the two-up grid free of a lone tile.
	const products = picturedFirst(data).slice(0, 12);
	return products.length > 1 && products.length % 2 ? products.slice(0, -1) : products;
}

/**
 * The original's split screen: on the left, under the logotype, an italic "Shop:" index of
 * every product name that stays pinned while the right column of tall product tiles scrolls.
 * Rendered without a Suspense boundary so the grid ships in the prerendered shell.
 */
export default async function Home() {
	const products = await getHomeProducts();

	return (
		<div data-split className="md:flex md:min-h-screen md:items-center">
			<div className="flex w-full flex-col gap-y-3 md:flex-row md:gap-x-10 md:gap-y-0">
				<div className="hidden md:sticky md:top-0 md:flex md:max-h-screen md:w-1/2 md:items-end md:pb-12 md:pt-12 md:self-start md:min-h-screen">
					<div>
						<h1 className="font-serif text-xl italic md:text-3xl">Shop:</h1>
						<p className="pt-3 text-lg md:text-xl lg:text-2xl">
							{products.map((product, index) => (
								<Fragment key={product.id}>
									{index ? ", " : ""}
									<Link href={`/product/${product.slug}`} className="hover:italic">
										{product.name}
									</Link>
								</Fragment>
							))}
						</p>
					</div>
				</div>

				<div className="py-6 md:z-40 md:w-1/2 md:py-12">
					<h1 className="sr-only md:hidden">Shop</h1>
					<div className="grid w-full gap-4 lg:grid-cols-2 xl:gap-8">
						{products.map((product, index) => (
							<ProductCard
								key={product.id}
								product={product}
								priority={index === 0}
								imageClassName="h-112 md:h-96 xl:h-112"
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
