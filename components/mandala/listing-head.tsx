import type { ReactNode } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

/** The original's listing head: big bold title, sort box on the right, a hairline under both. */
export function ListingHead({ title, toolbar }: { title: string; toolbar?: ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4 border-b border-border pb-6 pt-12 lg:pt-24">
			<h1 className="min-w-0 text-[1.75rem] font-bold leading-tight tracking-tight text-[#111827] [overflow-wrap:anywhere] sm:text-4xl">
				{title}
			</h1>
			{toolbar ? <div className="flex shrink-0 items-center gap-4">{toolbar}</div> : null}
		</div>
	);
}

export function ToolbarFallback() {
	return (
		<>
			<div aria-hidden className="h-10 w-40 rounded-sm border border-border sm:w-48" />
			<div aria-hidden className="size-7 lg:hidden" />
		</>
	);
}

export function ListingFallback({ title = "All products" }: { title?: string }) {
	return (
		<>
			<ListingHead title={title} toolbar={<ToolbarFallback />} />
			<div className="pt-6 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-x-8">
				<div className="hidden lg:block" />
				<div className="pt-2">
					<ProductGridSkeleton />
				</div>
			</div>
		</>
	);
}
