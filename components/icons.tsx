import type { SVGProps } from "react";

/** The original's hand-drawn oval that rings the "Shop now" call to action (Weaverse, MIT). */
export function EllipseIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 148 61" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
			<path d="M79.6774 5.47561C99.8959 9.77319 117.576 16.5012 129.814 23.8896C135.935 27.585 140.67 31.431 143.685 35.1995C146.703 38.9717 147.95 42.6023 147.248 45.9078C146.545 49.2133 143.929 52.0229 139.638 54.2414C135.351 56.4578 129.461 58.0452 122.365 58.9314C108.18 60.7033 89.2924 59.6587 69.0739 55.3611C48.8554 51.0636 31.1758 44.3355 18.9376 36.9472C12.8163 33.2517 8.08095 29.4058 5.06595 25.6373C2.04802 21.8651 0.801053 18.2345 1.50366 14.929C2.20628 11.6234 4.82214 8.81389 9.11343 6.59534C13.4006 4.37894 19.2908 2.79154 26.3859 1.90531C40.5712 0.133482 59.4589 1.17803 79.6774 5.47561Z" />
		</svg>
	);
}

/** A small botanical sprig that sits above the wordmark, in the spirit of the original's logo mark. */
export function SprigIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 40 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.1"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M8 22C14 16 22 10 34 3" />
			<path d="M14 17c-1.5-3.5-.5-6.5 2-8.5 1.2 3.2.4 6.2-2 8.5Z" />
			<path d="M19 13.5c-1-3.6.4-6.4 3.2-8 .8 3.4-.4 6.2-3.2 8Z" />
			<path d="M24 10c-.4-3.4 1.4-5.8 4.2-6.8.2 3.2-1.4 5.6-4.2 6.8Z" />
			<path d="M15 17.5c3.4.6 6.2-.5 8-3-3.3-.8-6.2.3-8 3Z" />
			<path d="M20.5 13.8c3.4.2 6-1.2 7.4-3.8-3.3-.4-5.9 1-7.4 3.8Z" />
			<path d="M26 10c3.2-.2 5.4-1.8 6.4-4.4-3.1 0-5.3 1.6-6.4 4.4Z" />
		</svg>
	);
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			{...props}
		>
			<path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
		</svg>
	);
}

export function BagIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			aria-hidden="true"
			{...props}
		>
			<path d="M5 8h14l-1 12.5H6L5 8Z" strokeLinejoin="round" />
			<path d="M9 10.5V6.5a3 3 0 0 1 6 0v4" strokeLinecap="round" />
		</svg>
	);
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			aria-hidden="true"
			{...props}
		>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" strokeLinecap="round" />
		</svg>
	);
}
