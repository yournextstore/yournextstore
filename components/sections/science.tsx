const stats = [
	{ value: "94%", label: "fell asleep faster within 14 nights" },
	{ value: "2.3×", label: "increase in self-reported deep rest" },
	{ value: "0mg", label: "of melatonin — no morning grogginess" },
];

const studies = [
	{
		journal: "Journal of Clinical Sleep Medicine",
		title: "Magnesium glycinate and sleep onset latency in adults with mild insomnia.",
	},
	{
		journal: "Phytotherapy Research",
		title: "Effect of ashwagandha root extract on stress markers and sleep quality.",
	},
	{
		journal: "Nutrients",
		title: "L-theanine and glycine co-supplementation for restorative slow-wave sleep.",
	},
];

export function Science() {
	return (
		<section id="science" className="bg-burgundy-deep text-cream relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_20%,oklch(0.42_0.13_8/0.55),transparent_70%)]"
			/>
			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-2xl">
					<p className="text-[10px] tracking-[0.32em] uppercase text-cream/70 mb-5">— Backed by Science —</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-cream">
						Quiet results, peer-reviewed.
					</h2>
					<p className="mt-5 text-cream/75 leading-relaxed">
						Every ingredient earns its place through clinical evidence. We formulate at doses studied in
						published research — not trace amounts on the back of a label.
					</p>
				</div>

				<div className="mt-14 grid gap-8 sm:grid-cols-3 border-y border-cream/15 py-12">
					{stats.map((s) => (
						<div key={s.label} className="text-center sm:text-left">
							<div className="font-serif text-5xl sm:text-6xl text-cream tracking-tight">{s.value}</div>
							<p className="mt-3 text-sm text-cream/70 leading-snug max-w-[20ch] sm:mx-0 mx-auto">
								{s.label}
							</p>
						</div>
					))}
				</div>

				<div className="mt-14 grid gap-6 sm:grid-cols-3">
					{studies.map((study) => (
						<article
							key={study.title}
							className="rounded-md border border-cream/15 bg-cream/[0.04] backdrop-blur-sm p-6"
						>
							<p className="text-[10px] tracking-[0.28em] uppercase text-mauve mb-3">{study.journal}</p>
							<p className="text-sm text-cream/85 leading-relaxed">{study.title}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
