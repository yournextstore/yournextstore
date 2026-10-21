import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two drawn swells, the original's mark: denim line over a fainter one. */
export function WaveMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 26 26" aria-hidden="true" focusable="false" className={cn("shrink-0", className)}>
			<path
				d="M2 17 Q6 9 10 13 T18 13 T24 11"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<path
				d="M4 21 Q8 15 12 18 T20 17"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				opacity=".55"
			/>
		</svg>
	);
}

/** The wordmark: the wave, then the store's name in wide-tracked Bebas Neue. */
export function BrandMark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn(
				"display inline-flex min-w-0 items-center gap-2.5 text-[1.25rem] leading-none tracking-[0.06em] sm:text-[1.45rem]",
				className,
			)}
		>
			<WaveMark className="size-[26px] text-denim-deep" />
			<span className="min-w-0 truncate pt-[0.12em]">{name}</span>
		</Link>
	);
}
