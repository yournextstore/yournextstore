import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

/** HiyoRi's listing bar: "Filter:" and its control on the left, "Sort by:" on the right. */
export function ListingToolbar({ filters, sort }: { filters?: ReactNode; sort?: ReactNode }) {
	return (
		<section aria-label="Listing options" className="flex min-h-9 items-center justify-between gap-4">
			<div className="flex items-center gap-x-3 md:gap-x-5">
				{filters ? (
					<>
						<span className="whitespace-nowrap text-sm md:text-base">Filter:</span>
						{filters}
					</>
				) : null}
			</div>
			{sort ? (
				<div className="flex items-center gap-x-1 md:gap-x-2">
					<span className="hidden whitespace-nowrap text-sm sm:inline md:text-base">Sort by:</span>
					{sort}
				</div>
			) : null}
		</section>
	);
}

/** Same box as the real toolbar, without the client controls (they read useSearchParams). */
export function ListingToolbarFallback({ filters = true }: { filters?: boolean }) {
	return (
		<ListingToolbar
			filters={
				filters ? (
					<span className="inline-flex h-9 items-center gap-1 text-sm md:text-base">
						Refine
						<ChevronDownIcon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
					</span>
				) : null
			}
			sort={
				<span className="inline-flex h-8 min-w-[7.5rem] sm:min-w-[9rem] items-center justify-between gap-2 px-3 text-sm">
					Newest
					<ChevronDownIcon className="h-4 w-4 opacity-50" aria-hidden="true" />
				</span>
			}
		/>
	);
}
