/** The original's triangle-and-spine mark: a generic peak, not a logo. */
export function BrandMark({ className, size = 20 }: { className?: string; size?: number }) {
	return (
		<svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" className={className}>
			<path d="M12 3 3 21h18L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity=".45" />
		</svg>
	);
}
