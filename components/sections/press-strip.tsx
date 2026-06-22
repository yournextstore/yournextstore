const PRESS = [
	{ name: "The Standard", quote: "“A masterclass in everyday object design.”" },
	{ name: "Field Quarterly", quote: "“Cool, in a way that doesn’t try.”" },
	{ name: "Studio Notes", quote: "“The cart you’ll actually leave by the door.”" },
	{ name: "Pavement Mag", quote: "“Forty-eight wheels later, still the best.”" },
	{ name: "Common Goods", quote: "“Hand-made, in spirit if not in fact.”" },
];

export function PressStrip() {
	return (
		<section aria-label="Press" className="bg-muted text-ink border-y border-ink/10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
							<span className="block h-px w-8 bg-brick" />
							As seen in
						</span>
						<div className="font-display-wide text-[clamp(1.4rem,2.4vw,2rem)] tracking-[0.04em] uppercase mt-3">
							The press
						</div>
					</div>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4 lg:gap-6 lg:border-l lg:border-ink/15 lg:pl-10">
						{PRESS.map((p) => (
							<div key={p.name} className="border-t border-ink/15 pt-4">
								<div className="font-display-wide text-[13px] tracking-[0.06em] uppercase">{p.name}</div>
								<p className="mt-1.5 text-[12px] text-ink/65 italic leading-snug">{p.quote}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
