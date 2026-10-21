// Line icons drawn after the original storefront's own set (bag, chevron, search, plus/minus, arrow).
// Each <svg> carries aria-hidden itself: Biome does not see it through a spread object.

type IconProps = { className?: string };

export function BagIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			width="21"
			height="26"
			viewBox="0 0 21 26"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.75 7.48649C5.75 7.48649 5.22222 1 10.5 1C15.7778 1 15.25 7.48649 15.25 7.48649M1 23.7027L2.00081 6.48252C2.03155 5.95366 2.46938 5.54054 2.99912 5.54054H18.0051C18.5331 5.54054 18.97 5.94786 19.0028 6.47487C19.3684 12.3442 20 22.7195 20 23.7027C20 24.7405 19.2963 25 18.9444 25C13.6667 25 2.9 25 2.05556 25C1.21111 25 1 24.1351 1 23.7027Z"
				stroke="currentColor"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function ChevronIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

export function SearchIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function UserIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.1}
			strokeLinecap="round"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="8" r="4.5" />
			<path d="M3.5 22c.6-4.6 4-7.5 8.5-7.5s7.9 2.9 8.5 7.5" />
		</svg>
	);
}

export function PlusIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M5 12h14" />
			<path
				d="M12 5v14"
				className="origin-center transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0"
			/>
		</svg>
	);
}

export function ArrowRightIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
		</svg>
	);
}

export function CloseIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
		>
			<path d="M18 6 6 18M6 6l12 12" />
		</svg>
	);
}

export function StarIcon({ className }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
		>
			<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
		</svg>
	);
}
