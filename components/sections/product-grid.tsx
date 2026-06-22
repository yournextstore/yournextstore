import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

const caption = (i: number) => {
	const captions = [
		"melts at a whisper",
		"good on everything",
		"a pantry heirloom",
		"slow simmered",
		"glints like honey",
		"the friday classic",
	];
	return captions[i % captions.length];
};

export async function ProductGrid({
	title = "the jars",
	description = "Small-batch ghee, cultured butter, and other shelf treasures.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background relative">
			<div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-28">
				<div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<div>
						<p className="font-mono mb-3 text-[11px] uppercase tracking-[0.3em] text-amber-deep">
							/ the shelf
						</p>
						<h2
							className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-mahogany sm:text-6xl lg:text-7xl"
							style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
						>
							{title}
						</h2>
						<p className="font-mono mt-4 max-w-md text-sm leading-relaxed text-mahogany/70">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="font-mono hidden text-[11px] uppercase tracking-[0.25em] text-mahogany/70 hover:text-mahogany sm:inline-flex"
						>
							shop all →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product, i) => (
						<div key={product.id} className="flex flex-col">
							<ProductCard product={product} />
							<p
								className="font-display mt-2 text-base italic text-amber-deep/90"
								style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
							>
								— {caption(i)}
							</p>
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center sm:hidden">
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="font-mono inline-flex text-[11px] uppercase tracking-[0.25em] text-mahogany/70 hover:text-mahogany"
						>
							shop all →
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
