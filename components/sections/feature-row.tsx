const FEATURES = [
	{
		idx: "I.",
		title: "Actives",
		body: "Bioactive concentrates isolated under refrigeration, never reconstituted from powder. Each ingredient retains its native enzymatic charge.",
		stat: "11 actives",
		statLabel: "tracked per batch",
	},
	{
		idx: "II.",
		title: "Formulation",
		body: "Phase-by-phase emulsion built around the male sebum profile. No aesthetic fillers, no fragrance designed to flatter the marketing.",
		stat: "0 fillers",
		statLabel: "in every formula",
	},
	{
		idx: "III.",
		title: "Skin biology",
		body: "Clinically observed in cohorts of 80 men over a 12-week protocol. We measure barrier resilience, sebum index, and trans-epidermal water loss.",
		stat: "−38% TEWL",
		statLabel: "after 12 weeks",
	},
];

export function FeatureRow() {
	return (
		<section
			className="relative parchment-noise border-y border-foreground/10"
			style={{ backgroundColor: "#f5efe4" }}
		>
			<div className="px-6 sm:px-10 lg:px-14 py-20 lg:py-28">
				<div className="grid lg:grid-cols-12 gap-10 mb-14">
					<div className="lg:col-span-4">
						<p className="eyebrow text-umber">The Protocol</p>
					</div>
					<div className="lg:col-span-8">
						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight max-w-2xl">
							<span className="italic text-umber/85">Three disciplines,</span> one ritual engineered for the
							male epidermis.
						</h2>
					</div>
				</div>

				<div className="grid sm:grid-cols-3 gap-0 border-t border-foreground/15">
					{FEATURES.map((f, i) => (
						<article
							key={f.title}
							className={`relative p-8 lg:p-10 ${
								i !== FEATURES.length - 1 ? "sm:border-r" : ""
							} border-foreground/10`}
						>
							<div className="flex items-center justify-between mb-10">
								<span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-taupe">{f.idx}</span>
								<span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-taupe/60">
									0{i + 1} / 03
								</span>
							</div>
							<h3 className="font-serif text-3xl lg:text-4xl text-ink mb-4 tracking-tight">{f.title}</h3>
							<p className="font-mono text-[0.78rem] leading-relaxed text-taupe/90 max-w-xs">{f.body}</p>
							<div className="mt-10 pt-5 border-t border-foreground/10 flex items-baseline gap-3">
								<span className="font-serif text-3xl text-ink">{f.stat}</span>
								<span className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-taupe">
									{f.statLabel}
								</span>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
