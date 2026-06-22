import Image from "next/image";

const PILLARS = [
	{
		k: "Source",
		v: "Atlantic basin, harvested at low light. Cold-chain transported within 18 hours of pull.",
	},
	{
		k: "Method",
		v: "Phase-by-phase emulsion. No nitrogen-blasted shortcuts, no powders rehydrated for volume.",
	},
	{
		k: "Skin",
		v: "Tested only on male cohorts at the dermal panel in Lisboa. Public results, every batch.",
	},
];

export function About() {
	return (
		<section
			id="about"
			className="relative bg-ink text-parchment border-y border-parchment/10"
			style={{ backgroundColor: "#0e0d0b" }}
		>
			<div className="grid lg:grid-cols-12">
				<div className="lg:col-span-5 relative min-h-[420px] lg:min-h-[640px]">
					<Image
						src="/scraped-4.jpg"
						alt="A morning ritual on raw oak"
						fill
						sizes="(max-width: 1024px) 100vw, 42vw"
						className="object-cover"
					/>
					<div
						className="absolute inset-0"
						style={{
							background:
								"linear-gradient(90deg, rgba(14,13,11,0.25) 0%, transparent 40%, rgba(14,13,11,0.5) 100%)",
						}}
					/>
					<div className="absolute top-6 left-6 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/70">
						<div>Plate 04</div>
						<div className="text-parchment/40">Ritual still life, 7:14 AM</div>
					</div>
				</div>
				<div className="lg:col-span-7 px-6 sm:px-10 lg:px-14 py-20 lg:py-28">
					<p className="eyebrow text-sand mb-6">The store as a quiet ritual</p>
					<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-parchment max-w-2xl">
						We don&apos;t sell skincare. <span className="italic text-sand">We sell five minutes</span> of
						attention to your own face.
					</h2>
					<p className="mt-8 font-mono text-[0.82rem] leading-relaxed text-parchment/75 max-w-xl">
						Your Next Store is a small biotech house writing skin protocols for men in the climates that
						ignore them: ocean winds, dry alpine cold, long flights, late shifts. Every formula here was first
						written for a person — then, after twelve weeks of measurement, for a catalogue.
					</p>

					<dl className="mt-12 border-t border-parchment/10">
						{PILLARS.map((p) => (
							<div key={p.k} className="grid grid-cols-12 gap-6 py-6 border-b border-parchment/10">
								<dt className="col-span-12 sm:col-span-3 font-mono text-[0.65rem] tracking-[0.3em] uppercase text-sand">
									{p.k}
								</dt>
								<dd className="col-span-12 sm:col-span-9 font-serif text-xl lg:text-2xl text-parchment/90 leading-snug">
									{p.v}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}
