/** The theme's own mark: a heavy six-spoke asterisk (stands in for the original's brand squiggle). */
export function SwagMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
			<g fill="currentColor">
				<rect x="13.5" y="1" width="5" height="30" />
				<rect x="13.5" y="1" width="5" height="30" transform="rotate(60 16 16)" />
				<rect x="13.5" y="1" width="5" height="30" transform="rotate(120 16 16)" />
			</g>
		</svg>
	);
}
