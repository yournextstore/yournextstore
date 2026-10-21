/** A patch jack seen head-on: amber ring and pin. Generic, drawn in code. */
export function BrandMark({ className, size = 24 }: { className?: string; size?: number }) {
	return (
		<svg viewBox="0 0 28 28" width={size} height={size} fill="none" aria-hidden="true" className={className}>
			<circle cx="14" cy="14" r="10.5" stroke="currentColor" strokeWidth="2.6" />
			<circle cx="14" cy="14" r="4" fill="currentColor" />
		</svg>
	);
}
