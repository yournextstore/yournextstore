import { Search } from "lucide-react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

/** Toolbar row + grid, the same heights as the real listing so nothing moves when it lands. */
export function ListingSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-4">
				<div className="h-11 w-28 animate-pulse rounded-md bg-gray-100 lg:h-9 lg:w-48" />
				<div className="h-9 w-20 animate-pulse rounded-md bg-gray-100 sm:w-44" />
			</div>
			<ProductGridSkeleton />
		</div>
	);
}

export function EmptyListing({ message = "Try adjusting your filters." }: { message?: string }) {
	return (
		<div className="py-12 text-center">
			<Search className="mx-auto size-12 text-gray-400" strokeWidth={1.5} aria-hidden />
			<p className="mt-4 text-lg font-medium text-ink">No products found</p>
			<p className="mt-2 text-muted-foreground">{message}</p>
		</div>
	);
}
