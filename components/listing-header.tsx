import Link from "next/link";
import { cn } from "@/lib/utils";

export type ListingTab = { href: string; label: string; active?: boolean };

/**
 * The original's collection header: the title set large in the Ballet script, over a row of
 * Italiana tabs with the current one underlined.
 */
export function ListingHeader({
	title,
	tabs,
	className,
}: {
	title: string;
	tabs: ListingTab[];
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col items-center pt-8 pb-8 text-center lg:pt-10", className)}>
			<h1 className="font-script text-display-lg text-balance sm:text-display-xl lg:text-display-2xl">
				{title}
			</h1>
			{tabs.length > 1 && (
				<nav aria-label="Browse" className="no-scrollbar mt-4 max-w-full overflow-x-auto">
					<ul className="flex w-max border-b border-slate-300">
						{tabs.map((tab) => (
							<li key={tab.href}>
								<Link
									href={tab.href}
									aria-current={tab.active ? "page" : undefined}
									className={cn(
										"-mb-px block border-b-2 px-2 pt-2 pb-1 font-display text-xl whitespace-nowrap transition-colors sm:px-4 sm:text-display-sm",
										tab.active
											? "border-ink text-ink"
											: "border-transparent text-slate-600 hover:border-slate-400 hover:text-ink",
									)}
								>
									{tab.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			)}
		</div>
	);
}

export const listingGridClassName =
	"grid grid-cols-1 gap-x-4 gap-y-8 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10";
