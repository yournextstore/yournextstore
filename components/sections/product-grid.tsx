import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { autoGrid } from "@/lib/grid";
import tilePhoto from "@/public/images/pexels/tile-studio.jpg";

export type Product = APIProductsBrowseResult["data"][number];
type AnyProduct =
	| Product
	| APICollectionGetByIdResult["productCollections"][number]["product"]
	| NonNullable<APIProductGetByIdResult>;

/**
 * The original's home grid: a photo tile introducing the range, then the products. On phones
 * the tile stays full width and the products become a sideways-scrolling rail.
 */
export function ProductGrid({ storeName, products }: { storeName: string; products: AnyProduct[] }) {
	if (products.length === 0) return null;

	return (
		<section aria-labelledby="home-products">
			<div className={`${autoGrid} mb-12`}>
				<div className="relative min-h-44 overflow-hidden bg-primary p-6 text-white">
					<Image
						src={tilePhoto}
						alt=""
						fill
						sizes="(max-width: 720px) 100vw, 25vw"
						className="object-cover object-[50%_20%] grayscale"
					/>
					<div
						aria-hidden
						className="absolute inset-0 bg-linear-to-b from-black/70 via-black/25 to-black/40"
					/>
					<div className="relative">
						<h2 id="home-products" className="text-2xl">
							Our products
						</h2>
						<p className="mt-1 max-w-64 text-sm text-white/85">
							See what {storeName} has to offer this season.
						</p>
					</div>
					<Button
						asChild
						variant="outline"
						size="icon"
						className="absolute right-4 bottom-4 border-transparent text-foreground"
					>
						<Link href="/products" aria-label="Browse all products">
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>
				<div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:contents">
					{products.map((product, index) => (
						<ProductCard
							key={product.id}
							product={product}
							priority={index < 2}
							className="w-2/3 shrink-0 snap-start sm:w-auto"
							sizes="(max-width: 720px) 66vw, (max-width: 1140px) 50vw, (max-width: 1440px) 33vw, 25vw"
						/>
					))}
				</div>
			</div>
			<div className="mb-14 flex justify-center">
				<Button asChild variant="outline">
					<Link href="/products">
						Shop all products
						<ArrowRightIcon className="size-4" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
