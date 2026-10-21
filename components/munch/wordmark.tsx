import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { wordmarkAdvance } from "@/lib/wordmark";

/**
 * The store name set in Climate Crisis capitals, sized so it spans the width the original's logo
 * artwork does (~230px on phones, 330-420px on desktop) whatever its length.
 */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	return (
		<span
			style={{ "--wm-adv": wordmarkAdvance(name) } as CSSProperties}
			className={cn(
				// Ink below xl: there the set size is under 24px, where the bright tomato fails AA.
				"font-display-d block whitespace-nowrap leading-none text-foreground xl:text-brand",
				"text-[length:min(27px,calc(min(230px,100vw-145px)/var(--wm-adv)))] lg:text-[length:min(44px,calc(330px/var(--wm-adv)))] xl:text-[length:min(44px,calc(420px/var(--wm-adv)))]",
				className,
			)}
		>
			{name}
		</span>
	);
}

/** The footer's full-bleed wordmark: one line spanning its container (place it in an `@container`). */
export function FooterWordmark({ name }: { name: string }) {
	return (
		<span
			aria-hidden="true"
			style={{ "--wm-adv": wordmarkAdvance(name) } as CSSProperties}
			className="font-display-d block whitespace-nowrap leading-[0.82] text-paper text-[length:calc(100cqw/var(--wm-adv))]"
		>
			{name}
		</span>
	);
}
