import Link from "next/link";
import type { ShopSection } from "@/lib/catalog";
import { fitDisplaySize } from "@/lib/display-type";
import { cn } from "@/lib/utils";

/** Giant section title sized to its own word, with the piece count beside it. */
export function ListingHeading({ title, count }: { title: string; count?: number | null }) {
	const style = {
		"--title-m": fitDisplaySize(title, { maxPx: 120, budgetPx: 300, vwBudget: 78 }),
		"--title-d": fitDisplaySize(title, { maxPx: 240, budgetPx: 1000, vwBudget: 66 }),
	} as React.CSSProperties;

	return (
		<div className="flex items-end justify-between gap-2 border-b border-line pb-5 pt-2 lg:gap-6 lg:pb-3 lg:pt-10">
			<h1
				style={style}
				className="min-w-0 whitespace-nowrap font-display text-[length:var(--title-m)] leading-[0.8] lg:text-[length:var(--title-d)]"
			>
				{title}
			</h1>
			{count != null ? (
				<span className="whitespace-nowrap pb-1 font-display text-[28px] font-extrabold normal-case leading-none tabular-nums lg:pb-3 lg:text-[56px]">
					{String(count).padStart(2, "0")}
					<span className="opacity-65 max-lg:sr-only"> pieces</span>
				</span>
			) : null}
		</div>
	);
}

const pill =
	"flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm transition-colors";

/** Section filter pills: All, then every section with its count; the current one is ink. */
export function SectionPills({
	sections,
	total,
	current,
}: {
	sections: ShopSection[];
	total: number;
	/** The current section's slug; undefined on the whole catalogue. */
	current?: string;
}) {
	const items = [{ href: "/products", name: "All", count: total, slug: undefined }, ...sections];
	return (
		<nav
			aria-label="Sections"
			className="-mx-4 flex min-w-0 gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0"
		>
			{items.map((item) => {
				const active = item.slug === current;
				return (
					<Link
						key={item.href}
						href={item.href}
						aria-current={active ? "page" : undefined}
						className={cn(
							pill,
							active
								? "border-foreground bg-foreground text-background"
								: "border-line hover:border-foreground",
						)}
					>
						{item.name}
						<span className="tabular-nums opacity-70">{item.count}</span>
					</Link>
				);
			})}
		</nav>
	);
}

/** Same size as the real controls, so nothing shifts when they land. */
export function ToolbarFallback() {
	return (
		<div aria-hidden="true" className="flex shrink-0 gap-1.5">
			<span className="h-10 w-[104px] rounded-full border border-line" />
			<span className="h-10 w-[150px] rounded-full border border-line" />
			<span className="hidden h-10 w-[88px] rounded-full border border-line lg:block" />
		</div>
	);
}

export function ListingGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div aria-hidden="true" className={className}>
			{Array.from({ length: count }, (_, index) => (
				<div key={index} className="flex flex-col gap-3">
					<div className="aspect-[3/4] animate-pulse rounded-photo bg-wash" />
					<div className="h-4 w-3/4 rounded-full bg-wash" />
					<div className="h-3 w-1/3 rounded-full bg-wash" />
				</div>
			))}
		</div>
	);
}
