import Link from "next/link";
import { cn } from "@/lib/utils";

/** The original's mark: a sheet with a torn (deckled) fore-edge and three lines of writing. */
export function SheetMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true" className={cn("shrink-0 text-ochre", className)}>
			<path
				d="M6 5 h17 l1.5 2 -1 2.4 1.4 2.6 -1.2 2.4 1.2 2.6 -1.4 2.4 1.2 2.6 -1.2 2.4 1 2.6 -1.5 2 h-17 Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<path
				d="M10 12 h9 M10 17 h9 M10 22 h6"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				opacity=".6"
			/>
		</svg>
	);
}

/** Mark + the store's name in the display serif, as the original's wordmark. */
export function BrandMark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn(
				"inline-flex min-w-0 items-center gap-2 font-display text-[1.12rem] leading-none sm:text-[1.2rem]",
				className,
			)}
		>
			<SheetMark className="size-[26px]" />
			<span className="min-w-0 truncate">{name}</span>
		</Link>
	);
}
