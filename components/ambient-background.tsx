/** The original's fixed ambient layer: two slow, blurred radial glows and a film-grain wash. */
export function AmbientBackground() {
	return (
		<div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="animate-breathe absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full blur-3xl [background:var(--ambient-a)]" />
			<div className="animate-breathe absolute -right-1/4 bottom-0 h-[60vh] w-[60vw] rounded-full blur-3xl [animation-duration:22s] [background:var(--ambient-b)]" />
			<div className="noise absolute inset-0" />
		</div>
	);
}
