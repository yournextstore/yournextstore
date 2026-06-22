export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-pop-yellow">
			<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-25 mix-blend-overlay" />
			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				<p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-primary">
					Hola, we&apos;re Your Next Store
				</p>
				<h2 className="mt-3 font-display text-5xl sm:text-7xl uppercase text-pop-ink leading-[0.92]">
					Born poolside, <br />
					<span className="text-primary">bottled boldly</span>
				</h2>
				<p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-pop-ink/80 leading-relaxed">
					We started in a Miami garage with a blender, a stack of popsicle molds, and a serious craving for
					cocktails that don&apos;t melt before the party starts. Every batch is small, every fruit is real,
					and every pop is 21% ABV of straight-up tropical joy.
				</p>
				<div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
					{[
						{ label: "Family-run", color: "bg-primary text-white" },
						{ label: "Cold-pressed", color: "bg-pop-mint text-pop-ink" },
						{ label: "Gluten-free", color: "bg-pop-orange text-white" },
						{ label: "Small-batch", color: "bg-pop-ink text-pop-yellow" },
					].map((badge) => (
						<span
							key={badge.label}
							className={`inline-flex items-center rounded-full px-5 py-2 text-xs uppercase tracking-[0.22em] font-bold ${badge.color}`}
						>
							{badge.label}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
