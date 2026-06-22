export function About() {
	return (
		<section id="about" className="bg-bone text-ink">
			<div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/70">
							<span className="block h-px w-8 bg-brick" />A short note
						</span>
						<h2 className="font-display-wide text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] uppercase mt-5 text-balance">
							We reframed
							<br />
							the everyday.
						</h2>
					</div>
					<div className="text-[15px] leading-[1.7] text-ink/80 space-y-5">
						<p>
							Your Next Store started with a quiet observation: the things people actually carry, wheel, fold
							and lean against the kitchen wall were beautiful in their honesty — but ugly on the shelf. So we
							rebuilt the catalog with the city in mind.
						</p>
						<p>
							Every piece is engineered around the messy reality of urban life — the cobblestone sprint to the
							bus, the four-flight walk-up, the impulse bouquet on the way home. Built to roll, fold, stack,
							and disappear into the room when you&apos;re done.
						</p>
						<div className="pt-3 grid grid-cols-3 gap-6 text-[11px] tracking-[0.28em] uppercase text-ink/60">
							<div>
								<div className="font-display-wide text-2xl text-ink tracking-[0.04em]">50L</div>
								<div className="mt-1">Real capacity</div>
							</div>
							<div>
								<div className="font-display-wide text-2xl text-ink tracking-[0.04em]">2.1kg</div>
								<div className="mt-1">Folded weight</div>
							</div>
							<div>
								<div className="font-display-wide text-2xl text-ink tracking-[0.04em]">10y</div>
								<div className="mt-1">Frame warranty</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
