// The original's hand-drawn 24px stroke icons, kept so the chrome reads the same.
type IconProps = { size?: number; className?: string };

export function SearchIcon({ size = 19, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			className={className}
		>
			<circle cx="11" cy="11" r="7" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

export function AccountIcon({ size = 19, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
		</svg>
	);
}

export function CartIcon({ size = 19, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<circle cx="9" cy="21" r="1.4" />
			<circle cx="19" cy="21" r="1.4" />
			<path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 7H6" />
		</svg>
	);
}

export function MenuIcon({ size = 20, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			className={className}
		>
			<path d="M3 5.5h14M3 10h14M3 14.5h14" />
		</svg>
	);
}

export function CloseIcon({ size = 16, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			className={className}
		>
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	);
}

export function MoonIcon({ size = 19, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
		</svg>
	);
}

export function SunIcon({ size = 19, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			className={className}
		>
			<circle cx="12" cy="12" r="4.5" />
			<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
		</svg>
	);
}

export function LayersIcon({ size = 21, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="m12 3 9 5-9 5-9-5 9-5z" />
			<path d="m3 12.5 9 5 9-5" />
			<path d="m3 17 9 5 9-5" />
		</svg>
	);
}

export function BeanIcon({ size = 21, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<ellipse cx="12" cy="12" rx="7" ry="9" />
			<path d="M12 3c-3 3.5-3 14.5 0 18" transform="rotate(35 12 12)" />
		</svg>
	);
}

export function ReturnIcon({ size = 21, className }: IconProps) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M9 14 4 9l5-5" />
			<path d="M4 9h10a6 6 0 0 1 0 12h-3" />
		</svg>
	);
}
