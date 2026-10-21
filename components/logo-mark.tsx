/** The original's skateboard glyph (a Tabler icon, MIT), drawn as currentColor line art. */
export function LogoMark({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<circle cx="7" cy="15" r="2" />
			<circle cx="17" cy="15" r="2" />
			<path d="M3 9a2 1 0 0 0 2 1h14a2 1 0 0 0 2 -1" />
		</svg>
	);
}
