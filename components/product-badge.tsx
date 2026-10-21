import { cn } from "@/lib/utils";

/** Fluid's pill badges: espresso "Sale", grey "Sold out". */
export function ProductBadge({ kind, className }: { kind: "sale" | "sold-out"; className?: string }) {
	return (
		<span
			className={cn(
				"inline-flex h-5 items-center rounded-full px-2 text-xs font-semibold leading-none",
				kind === "sale" ? "bg-primary text-primary-foreground" : "bg-badge-sold text-badge-sold-foreground",
				className,
			)}
		>
			{kind === "sale" ? "Sale" : "Sold out"}
		</span>
	);
}
