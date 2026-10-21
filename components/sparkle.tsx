import { cn } from "@/lib/utils";

/** Four-pointed star, the hero's spinning ornament. */
export function Sparkle({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 100 100" aria-hidden="true" className={cn("pointer-events-none fill-black", className)}>
			<path d="M50 0C52.6 30.4 69.6 47.4 100 50 69.6 52.6 52.6 69.6 50 100 47.4 69.6 30.4 52.6 0 50 30.4 47.4 47.4 30.4 50 0Z" />
		</svg>
	);
}
