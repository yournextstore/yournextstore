const SCENTS = [
	{ name: "Gem", swatch: "#c9b8c7", notes: "Honeydew · Cotton Flower · Blue Tansy · Lilac" },
	{ name: "Moss", swatch: "#5ba45b", notes: "Fir Needle · Hinoki Wood · Sage · Oakmoss" },
	{ name: "Smudge", swatch: "#d96a52", notes: "Wild Bergamot · Patchouli · Amber · Musk" },
	{ name: "Lull", swatch: "#dfe6dc", notes: "Unscented" },
];

export function ScentIndex() {
	return (
		<section className="bg-[var(--ivory)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center max-w-xl mx-auto">
					<p className="text-[11px] uppercase tracking-[0.32em] text-foreground/55">The Index</p>
					<h2 className="mt-4 font-serif italic text-4xl sm:text-5xl font-light tracking-tight text-foreground">
						Four scents, one ritual
					</h2>
					<p className="mt-4 text-[15px] leading-[1.7] text-foreground/70">
						Composed with perfumers and dosed at trace — the way a fragrance ought to live on linen.
					</p>
				</div>

				<div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
					{SCENTS.map((s) => (
						<div key={s.name} className="flex flex-col items-center text-center">
							<div
								className="h-16 w-16 rounded-full ring-1 ring-foreground/10"
								style={{ backgroundColor: s.swatch }}
							/>
							<h3 className="mt-5 font-serif text-xl tracking-[0.18em] uppercase font-light text-foreground">
								{s.name}
							</h3>
							<p className="mt-2 font-serif italic text-[12.5px] text-foreground/60 leading-snug max-w-[18ch]">
								{s.notes}
							</p>
						</div>
					))}
				</div>

				<div className="muse-divider mt-16" />
			</div>
		</section>
	);
}
