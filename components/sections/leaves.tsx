type LeafProps = {
	className?: string;
	color?: string;
	style?: React.CSSProperties;
};

export function Leaf({ className, color = "#2e7d3a", style }: LeafProps) {
	return (
		<svg
			viewBox="0 0 120 200"
			className={className}
			style={style}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				d="M60 4 C 22 30, 8 90, 28 160 C 36 184, 50 196, 60 196 C 70 196, 84 184, 92 160 C 112 90, 98 30, 60 4 Z"
				fill={color}
			/>
			<path d="M60 12 L60 192" stroke="#0f3d2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
			<path d="M60 40 C 48 50, 38 62, 32 78" stroke="#0f3d2e" strokeWidth="1.6" opacity="0.45" fill="none" />
			<path d="M60 40 C 72 50, 82 62, 88 78" stroke="#0f3d2e" strokeWidth="1.6" opacity="0.45" fill="none" />
			<path
				d="M60 80 C 48 92, 36 108, 32 128"
				stroke="#0f3d2e"
				strokeWidth="1.6"
				opacity="0.45"
				fill="none"
			/>
			<path
				d="M60 80 C 72 92, 84 108, 88 128"
				stroke="#0f3d2e"
				strokeWidth="1.6"
				opacity="0.45"
				fill="none"
			/>
			<path
				d="M60 130 C 50 140, 42 152, 40 168"
				stroke="#0f3d2e"
				strokeWidth="1.4"
				opacity="0.4"
				fill="none"
			/>
			<path
				d="M60 130 C 70 140, 78 152, 80 168"
				stroke="#0f3d2e"
				strokeWidth="1.4"
				opacity="0.4"
				fill="none"
			/>
		</svg>
	);
}

export function Banana({ className, color = "#2e7d3a", style }: LeafProps) {
	return (
		<svg
			viewBox="0 0 220 320"
			className={className}
			style={style}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				d="M110 8 C 60 30, 28 90, 32 170 C 35 230, 60 290, 90 308 C 96 312, 104 312, 110 308 L 110 8 Z"
				fill={color}
			/>
			<path
				d="M110 8 C 160 30, 192 90, 188 170 C 185 230, 160 290, 130 308 C 124 312, 116 312, 110 308 L 110 8 Z"
				fill={color}
				opacity="0.9"
			/>
			<path d="M110 14 L110 308" stroke="#0f3d2e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
			<g stroke="#0f3d2e" strokeWidth="1.8" opacity="0.45" fill="none">
				<path d="M110 50 C 90 65, 75 90, 65 120" />
				<path d="M110 50 C 130 65, 145 90, 155 120" />
				<path d="M110 100 C 88 118, 70 145, 60 180" />
				<path d="M110 100 C 132 118, 150 145, 160 180" />
				<path d="M110 160 C 92 180, 78 210, 72 240" />
				<path d="M110 160 C 128 180, 142 210, 148 240" />
				<path d="M110 220 C 98 238, 90 258, 88 280" />
				<path d="M110 220 C 122 238, 130 258, 132 280" />
			</g>
		</svg>
	);
}

export function Monstera({ className, color = "#0f3d2e", style }: LeafProps) {
	return (
		<svg
			viewBox="0 0 240 220"
			className={className}
			style={style}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				d="M120 14 C 50 24, 12 80, 18 140 C 22 180, 50 206, 90 210 C 110 212, 124 200, 130 184 L 130 168 L 110 162 L 150 152 L 110 144 L 162 130 L 116 120 L 168 100 L 120 90 L 168 70 L 124 56 L 158 36 L 134 30 C 130 22, 126 16, 120 14 Z M 120 14 C 190 24, 228 80, 222 140 C 218 180, 190 206, 150 210 C 130 212, 116 200, 110 184 L 110 168 L 130 162 L 90 152 L 130 144 L 78 130 L 124 120 L 72 100 L 120 90 L 72 70 L 116 56 L 82 36 L 106 30 C 110 22, 114 16, 120 14 Z"
				fill={color}
			/>
		</svg>
	);
}
