import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** A five-petal bloom in the original's coral, drawn here (the original's mark is a ✿ glyph). */
export function Bloom({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true" className={cn("shrink-0", className)} fill="currentColor">
			{[0, 72, 144, 216, 288].map((angle) => (
				<ellipse key={angle} cx="16" cy="8.6" rx="6" ry="7.4" transform={`rotate(${angle} 16 16)`} />
			))}
			<circle cx="16" cy="16" r="3.4" fill="var(--paper)" opacity="0.85" />
		</svg>
	);
}

/**
 * The original's "petal&stem" lockup, rebuilt from the store's name: the bloom, then the name
 * lower-cased in tight bold DM Sans; an ampersand in the name becomes the coral Playfair italic.
 */
export function BrandMark({ name, className }: { name: string; className?: string }) {
	const parts = name
		.trim()
		.toLowerCase()
		.split(/\s*&\s*/);
	return (
		<Link
			href="/"
			className={cn(
				"inline-flex min-w-0 items-center gap-2 text-[0.92rem] font-bold tracking-[-0.05em] sm:text-[1.05rem]",
				className,
			)}
		>
			<Bloom className="size-7 text-coral sm:size-8" />
			<span className="min-w-0 truncate">
				{parts.map((part, index) => (
					<Fragment key={`${part}-${index}`}>
						{index > 0 && (
							<em className="serif mx-[0.05em] text-[1.4em] font-normal text-coral italic">&amp;</em>
						)}
						{part}
					</Fragment>
				))}
			</span>
		</Link>
	);
}
