export function About() {
	return (
		<section id="about" className="bg-[var(--tropic-cream)] text-[#15323b]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="rounded-[40px] bg-[var(--tropic-cyan)] text-white px-6 sm:px-12 py-14 sm:py-20 relative overflow-hidden">
					<svg
						className="pointer-events-none absolute -bottom-10 -right-10 w-[280px] sm:w-[420px] opacity-30"
						viewBox="0 0 200 200"
						fill="none"
						aria-hidden="true"
					>
						<title>Leaf swirl</title>
						<path
							d="M180 20 C 120 20, 60 60, 40 130 C 30 165, 60 190, 100 180 C 150 168, 190 120, 180 20Z"
							stroke="white"
							strokeWidth="1.4"
						/>
						<path d="M180 20 C 130 60, 90 110, 70 175" stroke="white" strokeWidth="1" />
						<path d="M170 50 C 130 80, 100 120, 90 170" stroke="white" strokeWidth="0.8" />
					</svg>

					<div className="relative grid lg:grid-cols-12 gap-10 items-start">
						<div className="lg:col-span-6">
							<span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-yellow)] font-semibold">
								<span className="h-px w-8 bg-[var(--tropic-yellow)]" />
								Our Story
							</span>
							<h2 className="font-display italic mt-3 text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
								Made for the people
								<br />
								who don’t stay inside.
							</h2>
						</div>
						<div className="lg:col-span-6 space-y-5 text-[15px] sm:text-base text-white/85 leading-relaxed">
							<p>
								Your Next Store began on a humid summer porch with one stubborn question: why do the things
								that protect us outdoors smell, feel, and pollute like the 1950s? We didn’t love the answers,
								so we got to work.
							</p>
							<p>
								Five years and forty-two formula iterations later, we make plant-powered repellents and
								adventure essentials that go everywhere with you — humid jungle, alpine ridge, beach bonfire —
								without leaving anything behind on your skin or in the water.
							</p>
							<div className="flex flex-wrap gap-3 pt-3">
								{["DEET-free", "Reef-safe", "Cruelty-free", "B Corp pending", "Made in California"].map(
									(b) => (
										<span
											key={b}
											className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/90 backdrop-blur"
										>
											{b}
										</span>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
