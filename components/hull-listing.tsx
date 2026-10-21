import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";

type CardProduct = Parameters<typeof ProductCard>[0]["product"];

/** "Shop our Catalog" — title left, a line of copy right, ruled off below. */
export function ListingIntro({ title, description }: { title: string; description?: string | null }) {
	return (
		<section className="grid gap-4 border-b border-border px-4 py-12 md:grid-cols-2 md:gap-8 md:p-8 md:py-16 lg:py-20">
			<h1 className="text-h1">{title}</h1>
			{description ? <p className="max-w-xl text-h5 leading-[1.6] md:text-h4">{description}</p> : null}
		</section>
	);
}

/** The sticky tools strip under the header: filters left, sort right. */
export function ListingToolbar({ children }: { children: ReactNode }) {
	return (
		<div className="sticky top-[72px] z-20 flex min-h-[54px] items-center justify-between border-b border-border bg-background px-2 md:top-[96px] md:px-4">
			{children}
		</div>
	);
}

/** Ruled product cells, three across from 1024px. */
export function ListingGrid({ products }: { products: CardProduct[] }) {
	return (
		<div className="relative z-[1] overflow-hidden">
			<div className="-m-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						framed
						priority={index === 0}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				))}
			</div>
		</div>
	);
}

export function ListingCount({ shown, total }: { shown: number; total: number }) {
	return (
		<p className="border-t border-border p-4 text-center text-body md:py-8">
			Showing {shown} of {total} {total === 1 ? "product" : "products"}
		</p>
	);
}

export function ListingEmpty({ children }: { children: ReactNode }) {
	return <div className="min-h-[35vh] px-4 py-16 text-center text-h4">{children}</div>;
}

/** Same footprint as the toolbar + first row of cells, so the swap does not shift the page. */
export function ListingSkeleton({ withToolbar = true }: { withToolbar?: boolean }) {
	return (
		<div className="min-h-svh">
			{withToolbar && <div className="h-[55px] border-b border-border" />}
			<div className="relative overflow-hidden">
				<div className="-m-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }, (_, i) => (
						<div key={`s-${i}`} className="m-[-0.5px] border border-border p-8">
							<div className="aspect-square animate-pulse bg-muted" />
							<div className="mx-auto mt-4 h-9 w-1/2 animate-pulse bg-muted" />
							<div className="mx-auto mt-2 h-6 w-1/5 animate-pulse bg-muted" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
