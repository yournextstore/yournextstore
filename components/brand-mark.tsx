type BrandMarkProps = {
	className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
	return (
		<svg
			viewBox="0 0 240 120"
			className={className}
			role="img"
			aria-label="Your Next Store"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Your Next Store</title>
			{/* color-block popsicle stripes behind */}
			<g transform="translate(80 4)">
				<rect x="0" y="0" width="12" height="46" rx="2" fill="#FFC107" />
				<rect x="14" y="0" width="12" height="46" rx="2" fill="#E91E63" />
				<rect x="28" y="0" width="12" height="46" rx="2" fill="#7FD9CF" />
				<rect x="42" y="0" width="12" height="46" rx="2" fill="#F47C3C" />
				<rect x="56" y="0" width="12" height="46" rx="2" fill="#E91E63" />
				<rect x="70" y="0" width="12" height="46" rx="2" fill="#FFC107" />
			</g>

			{/* orange paint splash */}
			<path
				d="M82 50 Q92 70 110 64 Q124 60 132 70 Q142 82 158 74 Q172 68 180 54 L172 86 Q146 102 118 92 Q94 84 78 78 Z"
				fill="#F47C3C"
			/>

			{/* face circle */}
			<circle cx="124" cy="60" r="22" fill="#FFFFFF" stroke="#2F2F2F" strokeWidth="2" />

			{/* sunglasses */}
			<g>
				<rect x="108" y="54" width="13" height="9" rx="2" fill="#E91E63" />
				<rect x="124" y="54" width="13" height="9" rx="2" fill="#E91E63" />
				<rect x="121" y="56" width="3" height="3" fill="#E91E63" />
				<rect x="108" y="56" width="29" height="2" fill="#2F2F2F" opacity="0.25" />
			</g>

			{/* smile */}
			<path d="M118 70 Q124 76 130 70" stroke="#2F2F2F" strokeWidth="2" fill="none" strokeLinecap="round" />

			{/* brand wordmark */}
			<g fontFamily="'Bebas Neue', Impact, sans-serif" fontWeight="400">
				<text x="120" y="104" textAnchor="middle" fontSize="22" fill="#E91E63" letterSpacing="2">
					YOUR NEXT
				</text>
				<text x="120" y="118" textAnchor="middle" fontSize="11" fill="#7FD9CF" letterSpacing="6">
					✦ STORE ✦
				</text>
			</g>
		</svg>
	);
}
