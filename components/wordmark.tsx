import { cn } from "@/lib/utils";

// Monoton draws capitals at ~0.73em each (measured from the face's advance widths); spaces are
// narrower but the slack keeps a long name clear of the header buttons.
const EM_PER_CHAR = 0.74;

/**
 * The store name in the original's Monoton logo face. On phones it shrinks with the name's length
 * so a two-word store name fits beside the bag and menu buttons; from `sm` up it is the original 30px.
 */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	const em = Math.max(4, name.length * EM_PER_CHAR);
	return (
		<span
			className={cn(
				"font-logo block whitespace-nowrap [word-spacing:0.25em] leading-none uppercase transition-colors hover:text-red-800",
				"text-[length:min(1.875rem,calc((100vw-12.5rem)/var(--wm-em)))] sm:text-[length:min(1.875rem,calc((33vw-4rem)/var(--wm-em)))] lg:text-3xl",
				className,
			)}
			style={{ "--wm-em": em } as React.CSSProperties}
		>
			{name}
		</span>
	);
}
