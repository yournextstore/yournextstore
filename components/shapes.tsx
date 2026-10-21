import { cn } from "@/lib/utils";

// The cut-paper shapes of the original, redrawn as SVG: a flat fill, a hairline outline and a
// hard ink shadow offset down and to the right.

function starPoints(points: number, outer: number, inner: number, cx: number, cy: number, rotate = 0) {
	return Array.from({ length: points * 2 }, (_, i) => {
		const radius = i % 2 === 0 ? outer : inner;
		const angle = ((rotate - 90 + (i * 180) / points) * Math.PI) / 180;
		return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
	}).join(" ");
}

const HERO_STAR = starPoints(7, 120, 58, 124, 122, 2);
const FOOTER_STAR = starPoints(7, 112, 52, 140, 52, 18);

export function HeroStar({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 255 249" width="255" height="249" className={className} aria-hidden="true">
			<polygon points={HERO_STAR} transform="translate(4 4)" fill="var(--sp-ink)" />
			<polygon points={HERO_STAR} fill="var(--sp-orange)" stroke="var(--sp-ink)" strokeWidth="1.5" />
		</svg>
	);
}

export function HeroWedge({ className }: { className?: string }) {
	const d = "M8 2 L352 112 L338 133 L22 133 Q-6 70 8 2 Z";
	return (
		<svg viewBox="0 0 360 133" width="360" height="133" className={className} aria-hidden="true">
			<path d={d} transform="translate(5 3)" fill="var(--sp-ink)" />
			<path d={d} fill="var(--sp-yellow)" stroke="var(--sp-ink)" strokeWidth="1.5" />
		</svg>
	);
}

export function FooterStar({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 245 165" width="245" height="165" className={className} aria-hidden="true">
			<polygon points={FOOTER_STAR} transform="translate(4 4)" fill="var(--sp-ink)" />
			<polygon points={FOOTER_STAR} fill="var(--sp-lilac)" stroke="var(--sp-ink)" strokeWidth="1.5" />
		</svg>
	);
}

export function FooterQuarter({ className }: { className?: string }) {
	const d = "M0 0 L132 132 Q75 186 0 186 Z";
	return (
		<svg viewBox="0 0 138 196" width="138" height="196" className={className} aria-hidden="true">
			<path d={d} transform="translate(3 5)" fill="var(--sp-ink)" />
			<path d={d} fill="var(--sp-yellow)" stroke="var(--sp-ink)" strokeWidth="1.5" />
		</svg>
	);
}

export function FooterSlab({ className }: { className?: string }) {
	const d = "M0 92 L158 4 L200 80 L178 92 Z";
	return (
		<svg viewBox="0 0 210 92" width="210" height="92" className={className} aria-hidden="true">
			<path d={d} transform="translate(4 3)" fill="var(--sp-ink)" />
			<path d={d} fill="var(--sp-mint)" stroke="var(--sp-ink)" strokeWidth="1.5" />
		</svg>
	);
}

/** The small arrow the original sets after "Shop now", turned 45° up. */
export function ArrowUpRight({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="20"
			height="20"
			className={cn("shrink-0", className)}
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="square"
			aria-hidden="true"
		>
			<path d="M7 17 17 7M9 7h8v8" />
		</svg>
	);
}

/** Filled bag, the original's cart glyph. */
export function BagIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			className={className}
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M8 7V6a4 4 0 1 1 8 0v1h3.2l1 15H3.8l1-15H8Zm2 0h4V6a2 2 0 1 0-4 0v1Z" />
		</svg>
	);
}
