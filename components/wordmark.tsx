import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logo lock-up in the original's shape (small kicker over a heavy rounded word) built from the store
 * name: the last word is the big gradient word, anything before it the kicker. The balloon cluster is
 * a neutral stand-in for the original's brand mark.
 */
export function Wordmark({
	name,
	tone = "brand",
	className,
}: {
	name: string;
	tone?: "brand" | "white";
	className?: string;
}) {
	const words = name.trim().split(/\s+/);
	const big = words.length > 1 ? words.at(-1) : name;
	const kicker = words.length > 1 ? words.slice(0, -1).join(" ") : null;

	return (
		<Link href="/" className={cn("group flex items-end gap-2", className)}>
			<BalloonMark className="h-[0.95em] w-auto shrink-0 self-center" white={tone === "white"} />
			<span className="flex min-w-0 flex-col font-display leading-none">
				{kicker && (
					<span
						className={cn(
							"self-end truncate text-[0.42em] font-normal lowercase",
							tone === "white" ? "text-white" : "text-ink",
						)}
					>
						{kicker}
					</span>
				)}
				{kicker && " "}
				<span
					className={cn(
						"-mt-[0.05em] truncate pb-[0.08em] font-extrabold lowercase",
						tone === "white" ? "text-white" : "wordmark",
					)}
				>
					{big}
				</span>
			</span>
		</Link>
	);
}

export function BalloonMark({ className, white = false }: { className?: string; white?: boolean }) {
	return (
		<svg viewBox="0 0 64 72" className={className} aria-hidden="true" focusable="false">
			<defs>
				<linearGradient id={white ? "bm-w" : "bm-a"} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={white ? "#ffffff" : "#ff9a1f"} />
					<stop offset="1" stopColor={white ? "#ffffff" : "#ff5a1f"} />
				</linearGradient>
				<linearGradient id={white ? "bm-wb" : "bm-b"} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={white ? "#ffffff" : "#ff5aa8"} />
					<stop offset="1" stopColor={white ? "#ffffff" : "#ff2f8a"} />
				</linearGradient>
			</defs>
			<path d="M22 50 Q24 60 18 70" fill="none" stroke={white ? "#fff" : "#4c4d56"} strokeWidth="1.6" />
			<path d="M42 46 Q40 58 46 70" fill="none" stroke={white ? "#fff" : "#4c4d56"} strokeWidth="1.6" />
			<ellipse cx="22" cy="30" rx="18" ry="21" fill={`url(#${white ? "bm-w" : "bm-a"})`} />
			<ellipse
				cx="43"
				cy="27"
				rx="16"
				ry="19"
				fill={`url(#${white ? "bm-wb" : "bm-b"})`}
				opacity={white ? 0.85 : 0.95}
			/>
			<ellipse cx="15" cy="21" rx="4" ry="6" fill="#fff" opacity="0.45" />
			<ellipse cx="37" cy="18" rx="3.5" ry="5" fill="#fff" opacity="0.45" />
		</svg>
	);
}
