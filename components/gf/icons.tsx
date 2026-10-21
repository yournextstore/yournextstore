// Glyphs drawn after the Grofresh originals (MIT): filled tab-bar icons and the small cart-plus.

type IconProps = { className?: string };

export function CartPlusIcon({ className }: IconProps) {
	return (
		<svg
			className={className}
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M6.058 10.6a.65.65 0 1 1 0 1.3.65.65 0 0 1 0-1.3Z" />
			<path d="M10.1 10.6a.65.65 0 1 1 0 1.3.65.65 0 0 1 0-1.3Z" />
			<path d="M12.115 4.038H4.231l-.666-1.598a1.15 1.15 0 0 0-1.065-.71H1.154v1.154H2.5l2.737 6.568c.09.215.3.355.532.355h4.616c.24 0 .456-.15.54-.374l1.731-4.615a.577.577 0 0 0-.54-.78Zm-2.307 3.462H8.654v1.154H7.5V7.5H6.346V6.346H7.5V5.192h1.154v1.154h1.154V7.5Z" />
		</svg>
	);
}

export function HomeIcon({ className }: IconProps) {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M19.5 8.19V2.25h-3.75v2.74L12 1.5 0 12.75h3v9.75h6.75V15h4.5v7.5H21v-9.75h3l-4.5-4.56Z" />
		</svg>
	);
}

export function CartIcon({ className }: IconProps) {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M3.75 3a.75.75 0 0 0 0 1.5h.369a.75.75 0 0 1 .72.545l2.379 8.325A2.25 2.25 0 0 0 9.381 15h6.854a2.25 2.25 0 0 0 2.089-1.415l2.211-5.528A1.5 1.5 0 0 0 19.143 6H6.672l-.392-1.368A2.25 2.25 0 0 0 4.119 3H3.75ZM9.75 21a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm6 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
		</svg>
	);
}

export function ProfileIcon({ className }: IconProps) {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M19.652 19.405c.552-.115.882-.693.607-1.187-.606-1.087-1.56-2.043-2.78-2.771C15.907 14.509 13.98 14 12 14s-3.907.508-5.479 1.447c-1.22.728-2.174 1.684-2.78 2.771-.275.494.055 1.072.607 1.187a37.2 37.2 0 0 0 15.303 0" />
			<path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
		</svg>
	);
}

export function GridIcon({ className }: IconProps) {
	return (
		<svg
			className={className}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<rect x="3" y="3" width="8" height="8" rx="2.5" />
			<rect x="13" y="3" width="8" height="8" rx="2.5" />
			<rect x="3" y="13" width="8" height="8" rx="2.5" />
			<rect x="13" y="13" width="8" height="8" rx="4" />
		</svg>
	);
}

export function BackIcon({ className }: IconProps) {
	return (
		<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M14.423 17.308 8.654 11.539l5.769-5.77"
				stroke="currentColor"
				strokeWidth="1.43"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/** An empty market basket, drawn for this theme (the original's illustration is not reused). */
export function EmptyBasket({ className }: IconProps) {
	return (
		<svg className={className} width="150" height="130" viewBox="0 0 150 130" fill="none" aria-hidden="true">
			<path d="M75 8v14M52 16l7 10M98 16l-7 10" stroke="#1d2b36" strokeWidth="5" strokeLinecap="round" />
			<rect x="22" y="44" width="106" height="13" rx="4" fill="#00824b" stroke="#1d2b36" strokeWidth="5" />
			<path
				d="M30 57h90l-9 54a6 6 0 0 1-6 5H45a6 6 0 0 1-6-5l-9-54Z"
				fill="#339b6f"
				stroke="#1d2b36"
				strokeWidth="5"
				strokeLinejoin="round"
			/>
			<path
				d="M54 70v32M66 70v32M78 70v32M90 70v32M102 70v32"
				stroke="#1d2b36"
				strokeWidth="5"
				strokeLinecap="round"
			/>
			<path d="M18 92 70 38M132 92 80 38" stroke="#1d2b36" strokeWidth="11" strokeLinecap="round" />
			<path d="M18 92 70 38M132 92 80 38" stroke="#f2c38b" strokeWidth="5" strokeLinecap="round" />
		</svg>
	);
}
