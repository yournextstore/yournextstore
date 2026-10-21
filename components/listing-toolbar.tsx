import { FilterIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Penny's filter bar: a hairline band across the page with the Filters toggle at the left and
 * Sort at the right. The fallback draws the same band so the grid below never moves.
 */
export function ListingToolbar({ start, end }: { start?: ReactNode; end?: ReactNode }) {
	return (
		<div className="border-y border-gray-200">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{start ?? <span />}
				{end ?? <span />}
			</div>
		</div>
	);
}

export function ListingToolbarFallback({
	filters = true,
	sort = true,
}: {
	filters?: boolean;
	sort?: boolean;
}) {
	return (
		<ListingToolbar
			start={
				filters ? (
					<span className="flex items-center text-sm font-medium text-gray-700">
						<FilterIcon className="mr-2 h-5 w-5 flex-none text-gray-500" aria-hidden="true" />
						Filters
					</span>
				) : undefined
			}
			end={sort ? <span className="text-sm font-medium text-gray-700">Sort</span> : undefined}
		/>
	);
}
