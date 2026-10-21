/** The half-step: two treads of a stair, drawn as one square-capped stroke. */
export function BrandMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 28 28" className={className} aria-hidden="true" focusable="false">
			<path
				d="M4 23 H13 V14 H22 V5"
				fill="none"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="square"
			/>
		</svg>
	);
}
