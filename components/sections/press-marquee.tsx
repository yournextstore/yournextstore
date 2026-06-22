const QUOTES = [
	{ source: "Nightwalker Weekly", quote: "An object you'll keep forever." },
	{ source: "Slow Studio", quote: "Designed like a poem." },
	{ source: "The Quiet Review", quote: "A rare kind of confident." },
	{ source: "Folio Magazine", quote: "Finally, an antidote to noise." },
	{ source: "Late Hours", quote: "It belongs in a museum drawer." },
	{ source: "Object Journal", quote: "Calm, beautifully made, exact." },
];

export function PressMarquee() {
	const doubled = [...QUOTES, ...QUOTES];
	return (
		<section className="relative bg-[#050817] py-20 sm:py-28 overflow-hidden">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			<div className="text-center mb-12 px-6">
				<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
					Said in the press
				</p>
			</div>

			<div className="relative">
				{/* fade edges */}
				<div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050817] to-transparent z-10 pointer-events-none" />
				<div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050817] to-transparent z-10 pointer-events-none" />

				<div className="flex animate-marquee" style={{ width: "max-content" }}>
					{doubled.map((q, i) => (
						<div key={`${q.source}-${i}`} className="flex items-center gap-6 px-10 shrink-0">
							<div className="h-px w-12 bg-[#4a76ff]/30" />
							<blockquote className="font-serif text-2xl sm:text-3xl font-light text-[#b8b6ce] italic">
								&ldquo;{q.quote}&rdquo;
							</blockquote>
							<cite className="text-[11px] uppercase tracking-[0.3em] not-italic text-muted-foreground">
								— {q.source}
							</cite>
						</div>
					))}
				</div>
			</div>

			<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
		</section>
	);
}
