import Image from "next/image";

const QUOTES = [
	{ source: "Modern Family", quote: "The cuddliest plush we have ever met." },
	{ source: "Nest", quote: "Each character feels like an heirloom in the making." },
	{ source: "Storyland", quote: "Lifelong companions with the softest stitched smiles." },
];

export function PressStrip() {
	return (
		<section aria-label="Press" className="bg-background border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-[44%_1fr] gap-10 lg:gap-16 items-center">
					<div className="relative aspect-[5/4] rounded-[32px] overflow-hidden">
						<Image
							src="/scraped-3.jpg"
							alt="Editorial behind-the-scenes plush styling"
							fill
							sizes="(max-width: 1024px) 100vw, 44vw"
							className="object-cover"
						/>
						<div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur px-4 py-3 text-sm text-[var(--color-ink)]">
							<span className="font-heading text-base" style={{ fontVariationSettings: "'SOFT' 100" }}>
								Made by hand in our London studio
							</span>
							<span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
								Behind the seams →
							</span>
						</div>
					</div>
					<div>
						<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-mint-deep)]">
							As seen in
						</span>
						<h2
							className="mt-3 font-heading text-3xl sm:text-4xl leading-tight text-foreground"
							style={{ fontVariationSettings: "'SOFT' 100" }}
						>
							Loved by little ones &amp; the press alike.
						</h2>
						<ul className="mt-8 grid sm:grid-cols-3 gap-6">
							{QUOTES.map((q) => (
								<li key={q.source} className="rounded-2xl bg-[var(--color-mint-soft)]/60 p-5">
									<p className="text-sm leading-relaxed text-[var(--color-ink)]">&ldquo;{q.quote}&rdquo;</p>
									<p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-ink)]/60">
										— {q.source}
									</p>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
