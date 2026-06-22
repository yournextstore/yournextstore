import Image from "next/image";

const FEATURES = [
	{
		title: "Foldable frame",
		spec: "2.1kg",
		note: "Folds flat in 3 seconds. Stands itself up against any wall.",
	},
	{
		title: "All-terrain wheels",
		spec: "120mm",
		note: "Cobblestones, curbs, transit gaps. Silent rubber, sealed bearings.",
	},
	{
		title: "Water-resistant canvas",
		spec: "1000D",
		note: "Waxed exterior. Wipes clean. Smells like nothing.",
	},
	{
		title: "Capacity",
		spec: "50L",
		note: "Holds a week of groceries, a week of laundry, or one impulse purchase.",
	},
];

export function FeatureRow() {
	return (
		<section className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] bg-clay overflow-hidden">
							<Image
								src="/scraped-5.jpg"
								alt="Folded against the brick wall"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-ink text-bone px-2.5 py-1 text-[9px] tracking-[0.3em] uppercase">
								<span className="block w-1 h-1 bg-brick" /> Detail · 01
							</div>
							<div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-[10px] tracking-[0.3em] uppercase text-bone/90">
								<span>Folded · 2.1kg · 18cm thick</span>
								<span>04 · 06</span>
							</div>
						</div>
					</div>

					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
							<span className="block h-px w-8 bg-brick" />
							No. 03 — Built
						</span>
						<h2 className="font-display-wide text-[clamp(2rem,4.8vw,3.75rem)] leading-[0.95] uppercase mt-4 text-balance">
							Engineered like
							<br />
							you carry it.
						</h2>
						<p className="mt-5 max-w-md text-base text-ink/75 leading-relaxed">
							Spec sheet for the obsessives. Every part is sourced for repair, not replacement — because
							nothing should retire before you do.
						</p>

						<dl className="mt-10 divide-y divide-ink/15 border-t border-b border-ink/15">
							{FEATURES.map((f, idx) => (
								<div key={f.title} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-5">
									<dt className="text-[10px] tracking-[0.3em] uppercase text-ink/50 tabular-nums">
										{String(idx + 1).padStart(2, "0")}
									</dt>
									<div>
										<div className="font-display-wide text-base tracking-[0.04em] uppercase">{f.title}</div>
										<div className="text-sm text-ink/65 mt-1">{f.note}</div>
									</div>
									<dd className="font-display-wide text-xl tracking-[0.04em] text-ink tabular-nums">
										{f.spec}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
