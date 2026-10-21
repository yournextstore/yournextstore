import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="border-r border-b border-gray-200 p-4 sm:p-6">
			<div className="aspect-[3/4] animate-pulse rounded-lg bg-gray-200" />
			<div className="flex flex-col items-center pt-10 pb-4">
				<div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
				<div className="mt-4 h-6 w-1/3 animate-pulse rounded bg-gray-100" />
			</div>
		</div>
	);
}

/** Same bordered cells as the real grid, so the swap does not move anything. */
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<ProductCells className={className}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</ProductCells>
	);
}

/** Penny's category grid: a hairline frame that each cell completes with its right and bottom borders. */
export function ProductCells({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<section className={cn("mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8", className)}>
			<h2 className="sr-only">Products</h2>
			<div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
				{children}
			</div>
		</section>
	);
}

/** Penny's centred listing title. */
export function ListingHeader({ title, description }: { title: string; description?: string | null }) {
	return (
		<div className="px-4 py-16 text-center sm:px-6 lg:px-8">
			<h1 className="text-4xl font-extrabold tracking-tight wrap-break-word text-gray-900">{title}</h1>
			{description && <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">{description}</p>}
		</div>
	);
}
