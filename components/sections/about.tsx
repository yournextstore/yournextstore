import Image from "next/image";

export function About() {
	return (
		<section id="about" className="bg-editorial-warm border-t border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div className="relative aspect-[4/5] overflow-hidden">
					<Image
						src="/scraped-3.jpg"
						alt="Atelier interior"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<div className="max-w-xl">
					<p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">The Atelier</p>
					<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.01em] text-foreground">
						An archive of considered design.
					</h2>
					<div className="editorial-rule mt-8 w-24" />
					<p className="mt-8 text-base sm:text-lg leading-relaxed text-foreground/70">
						Your Next Store is a quiet rebellion against fast fashion. Each piece is sourced from independent
						ateliers, archived couture, and small-batch makers — chosen for the way a fabric moves, the
						integrity of a stitch, the patience of the hand behind it.
					</p>
					<p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground/70">
						We believe the wardrobe is a personal library. We curate it like one.
					</p>
					<div className="mt-10 flex flex-wrap items-center gap-8 text-[11px] tracking-[0.25em] uppercase text-foreground/80">
						<span className="flex items-center gap-2">
							<span className="h-1 w-1 rounded-full bg-[color:var(--champagne)]" />
							Ethically sourced
						</span>
						<span className="flex items-center gap-2">
							<span className="h-1 w-1 rounded-full bg-[color:var(--champagne)]" />
							Small-batch
						</span>
						<span className="flex items-center gap-2">
							<span className="h-1 w-1 rounded-full bg-[color:var(--champagne)]" />
							Worldwide shipping
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
