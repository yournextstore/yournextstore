import type { SVGProps } from "react";

// Hand-drawn line icons from Emerald Garden (MIT, see NOTICE.md).
type IconProps = SVGProps<SVGSVGElement>;

const line = {
	fill: "none",
	stroke: "currentColor",
	strokeLinecap: "round",
	strokeLinejoin: "round",
} as const;

export function LeafGlyph(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M3 21C3 12 9 5 21 4c0 12-7 17-15 17H3z"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
			<path d="M3 21c3.4-6 8-9.6 14-11.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	);
}

export function RuleSquiggle(props: IconProps) {
	return (
		<svg viewBox="0 0 90 9" fill="none" aria-hidden="true" {...props}>
			<path
				d="M1 6.5C14 2.4 26 7.6 39 4.2 52 .8 64 7.4 78 3.6c4-1 8-1.2 11-.6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function ArrowSquiggle(props: IconProps) {
	return (
		<svg viewBox="0 0 70 14" fill="none" aria-hidden="true" {...props}>
			<path
				d="M2 3c10 8 20 9 30 4 8-4 15-3 22 3"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
			<path
				d="M47 12.6 55.5 9 54 14.5"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function NoteHeart(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" strokeWidth="1.25" aria-hidden="true" {...line} {...props}>
			<path d="M12 20.7C11.6 20.4 4.2 15.2 4.2 10.1 4.2 7.3 6.1 5.5 8.3 5.5c1.8 0 3 1.2 3.7 2.5.7-1.3 1.9-2.5 3.7-2.5 2.2 0 4.1 1.8 4.1 4.6 0 5.1-7.4 10.3-7.8 10.6z" />
		</svg>
	);
}

export function IconSeedling(props: IconProps) {
	return (
		<svg viewBox="0 0 40 40" strokeWidth="1.5" aria-hidden="true" {...line} {...props}>
			<path d="M10.5 33h19" />
			<path d="M20 33V19.5" />
			<path d="M20 25c-6.6 0-11.6-4.7-12.4-11 6.8.2 11.9 4.8 12.4 11z" />
			<path d="M20 25c6.6 0 11.6-4.7 12.4-11-6.8.2-11.9 4.8-12.4 11z" />
		</svg>
	);
}

export function IconDelivery(props: IconProps) {
	return (
		<svg viewBox="0 0 40 40" strokeWidth="1.5" aria-hidden="true" {...line} {...props}>
			<path d="M4 13h16.5v12H4z" />
			<path d="M20.5 17h5.4l5.1 4.3V25H20.5z" />
			<circle cx="11" cy="27.5" r="2.6" />
			<circle cx="26" cy="27.5" r="2.6" />
		</svg>
	);
}

export function IconSupport(props: IconProps) {
	return (
		<svg viewBox="0 0 40 40" strokeWidth="1.5" aria-hidden="true" {...line} {...props}>
			<path d="M20 10.6c-1.9-2.6-5.6-2.1-5.6.8 0 2.4 3.2 4.3 5.6 6.1 2.4-1.8 5.6-3.7 5.6-6.1 0-2.9-3.7-3.4-5.6-.8z" />
			<path d="M8 22.6c0-2.2 1.8-4 4-4h2.2" />
			<path d="M8 22.6c0 5.2 5.4 9.4 12 9.4s12-4.2 12-9.4" />
			<path d="M32 22.6c0-2.2-1.8-4-4-4h-2.2" />
		</svg>
	);
}

export function IconPottedTree(props: IconProps) {
	return (
		<svg viewBox="0 0 40 40" strokeWidth="1.5" aria-hidden="true" {...line} {...props}>
			<path d="M20 27.5V15" />
			<path d="M20 21c-6.2 0-10.9-4.4-11.6-10.4 6.4.2 11.2 4.5 11.6 10.4z" />
			<path d="M20 21c6.2 0 10.9-4.4 11.6-10.4-6.4.2-11.2 4.5-11.6 10.4z" />
			<path d="M10.6 27.5h18.8" />
			<path d="M12.2 27.5h15.6l-1.7 6H13.9z" />
		</svg>
	);
}

export function IconSearch(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" strokeWidth="1.7" aria-hidden="true" {...line} {...props}>
			<circle cx="11" cy="11" r="6.5" />
			<path d="m16 16 4.5 4.5" />
		</svg>
	);
}

export function IconBasket(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" strokeWidth="1.7" aria-hidden="true" {...line} {...props}>
			<path d="M6 8h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8z" />
			<path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
		</svg>
	);
}

export function IconUser(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" strokeWidth="1.7" aria-hidden="true" {...line} {...props}>
			<circle cx="12" cy="8.5" r="3.6" />
			<path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
		</svg>
	);
}

export function IconMenu(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" strokeWidth="1.7" aria-hidden="true" {...line} {...props}>
			<path d="M3 7h18M3 12h18M3 17h13" />
		</svg>
	);
}

export function IconClose(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" strokeWidth="1.7" aria-hidden="true" {...line} {...props}>
			<path d="M6 6l12 12M18 6 6 18" />
		</svg>
	);
}
