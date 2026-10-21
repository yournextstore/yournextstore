import { ChevronUp } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { resolveSort } from "@/lib/sort";

export const PAGE_SIZE = 12;
// The API's page cap: "View More" grows one list rather than paging, as the original does.
const MAX_SHOWN = 100;

export type ShopParams = { page?: string; sort?: string };

/** The original's taupe title band above every listing. */
export function ShopBanner({ title }: { title: string }) {
	return (
		<div className="my-10 flex items-center justify-center bg-taupe px-4 py-10 text-white">
			<h1 className="text-center text-3xl [overflow-wrap:anywhere] max-sm:text-2xl">{title}</h1>
		</div>
	);
}

async function browse(category: string | undefined, page: number, sort: string | undefined) {
	"use cache";
	cacheLife("minutes");
	const { orderBy, orderDirection } = resolveSort(sort);
	return commerce.productBrowse({
		active: true,
		limit: Math.min(PAGE_SIZE * page, MAX_SHOWN),
		offset: 0,
		orderBy,
		orderDirection,
		...(category ? { category } : {}),
	});
}

function href(basePath: string, page: number, sort: string) {
	const params = new URLSearchParams();
	if (sort !== "newest") params.set("sort", sort);
	if (page > 1) params.set("page", String(page));
	return params.size ? `${basePath}?${params}` : basePath;
}

/** Toolbar, grid and the "Showing n of m / View More / Back to Top" footer of a listing. */
export async function ShopResults({
	basePath,
	category,
	params,
}: {
	basePath: string;
	category?: string;
	params: ShopParams;
}) {
	const page = Math.max(1, Number(params.page) || 1);
	const sort = resolveSort(params.sort).value;
	const result = await browse(category, page, sort);
	const total = result.meta.count;
	const shown = result.data.length;

	return (
		<div className="min-h-svh">
			<div className="flex items-center justify-between gap-5 max-sm:flex-col">
				<p className="text-lg">{shown > 0 ? `Showing 1–${shown} of ${total} results` : "No results"}</p>
				<SortSelect basePath={basePath} current={sort} />
			</div>

			{shown === 0 ? (
				<p className="py-24 text-center text-lg text-muted-foreground">There are no products here yet.</p>
			) : (
				<div
					id="grid-top"
					className="mt-12 grid scroll-mt-6 grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
				>
					{result.data.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 3} />
					))}
				</div>
			)}

			{shown > 0 && (
				<div className="mx-auto mt-12 flex w-1/2 flex-col items-center justify-center gap-6 max-sm:w-3/4 max-sm:gap-5">
					<p className="text-xl max-sm:text-lg">
						Showing {shown} of {total}
					</p>
					{shown < total && shown < MAX_SHOWN && (
						<Link href={href(basePath, page + 1, sort)} scroll={false} className="btn-white">
							View More
						</Link>
					)}
					<a href="#grid-top" className="flex items-center justify-center gap-2 text-xl max-sm:text-lg">
						Back to Top <ChevronUp className="h-5 w-5" aria-hidden="true" />
					</a>
				</div>
			)}
		</div>
	);
}

export function ShopResultsSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="flex items-center justify-between gap-5 max-sm:flex-col">
				<div className="h-7 w-56 animate-pulse bg-secondary" />
				<div className="h-8 w-56 animate-pulse bg-secondary" />
			</div>
			<div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={`s-${i}`} className="flex flex-col gap-2">
						<div className="aspect-[3/4] animate-pulse bg-secondary" />
						<div className="mx-auto mt-1 h-8 w-3/4 animate-pulse bg-secondary" />
						<div className="mx-auto h-5 w-1/3 animate-pulse bg-secondary" />
						<div className="mx-auto h-7 w-1/4 animate-pulse bg-secondary" />
						<div className="mt-1 h-12 animate-pulse bg-secondary" />
						<div className="h-12 border border-border" />
					</div>
				))}
			</div>
		</div>
	);
}
