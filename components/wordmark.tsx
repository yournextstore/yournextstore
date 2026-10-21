import { cn } from "@/lib/utils";

/**
 * The store name set as the original's poster-width logotype: one line of display type
 * stretched to the exact width of its column, whatever the name's length.
 */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 1000 196"
			preserveAspectRatio="none"
			className={cn("pointer-events-none block h-auto w-full overflow-visible", className)}
		>
			<text
				x="0"
				y="190"
				textLength="1000"
				lengthAdjust="spacingAndGlyphs"
				fontSize="262"
				fill="currentColor"
				style={{ fontFamily: "var(--font-ultra), serif" }}
			>
				{name.toUpperCase()}
			</text>
		</svg>
	);
}
