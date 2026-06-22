type WipMonogramProps = {
	className?: string;
};

export function WipMonogram({ className }: WipMonogramProps) {
	return (
		<svg
			viewBox="0 0 120 44"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<title>YNS</title>
			<path
				d="M4 6 L18 38 L24 38 L30 18 L36 38 L42 38 L56 6 L48 6 L40 28 L34 8 L26 8 L20 28 L12 6 Z"
				fill="currentColor"
			/>
			<path d="M60 6 L66 6 L80 28 L80 6 L86 6 L86 38 L80 38 L66 16 L66 38 L60 38 Z" fill="currentColor" />
			<path
				d="M92 30 C92 35 96 38 102 38 C110 38 114 34 114 30 C114 26 110 24 104 22 C100 21 98 20 98 18 C98 16 100 14 103 14 C106 14 108 16 108 18 L114 18 C114 13 110 8 102 8 C95 8 92 12 92 16 C92 20 95 22 100 24 C104 25 108 26 108 28 C108 30 106 32 102 32 C99 32 96 30 96 28 L92 28 Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export function WipBenefitGlyph({ className }: WipMonogramProps) {
	return (
		<svg
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<title>YNS mark</title>
			<path
				d="M2 4 L8 28 L12 28 L16 14 L20 28 L24 28 L30 4 L26 4 L22 22 L18 6 L14 6 L10 22 L6 4 Z"
				fill="currentColor"
			/>
		</svg>
	);
}
