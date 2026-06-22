export function About() {
	return (
		<section id="story" className="bg-[var(--cream)]">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col items-center text-center">
					<span className="heritage-smallcaps text-[var(--oxblood)]">Est. an heirloom, made today</span>
					<h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.01em] text-[var(--ink)] max-w-3xl">
						A mattress, <em className="italic text-[var(--oxblood)]">faithfully made</em> — woven, tufted, and
						rested in by hand.
					</h2>
				</div>

				<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 text-[var(--ink)]/85">
					<p className="heritage-drop-cap text-[15px] leading-[1.75] font-sans">
						Your Next Store keeps faith with the slow trades. Every mattress, pillow, and length of bedding is
						composed of natural cotton, horsehair, and wool — drawn into a heavy ticking-striped shell and
						tufted by needle through the small hours, in the same fashion a workshop on Elizabeth Street might
						have tied them in 1903.
					</p>
					<p className="text-[15px] leading-[1.75] font-sans">
						Nothing here is engineered for the showroom floor. Each piece is built for a particular bed in a
						particular room, and is intended to be repaired, re-tufted, and handed down. If you would like to
						know who stitched yours, the maker’s mark is sewn discreetly into the corner — write to them, and
						they will write back.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="heritage-rule" />
			</div>
		</section>
	);
}
