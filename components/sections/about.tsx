import Image from "next/image";

export function About() {
	return (
		<section id="about" className="bg-background border-t border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					<div className="lg:col-span-7 relative aspect-[4/5] gallery-frame overflow-hidden">
						<Image
							src="/scraped-4.jpg"
							alt="Boutique interior with terrazzo floors and floating clothing rails"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
					</div>
					<div className="lg:col-span-5 lg:pl-8">
						<p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">The Atelier</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] tracking-tight">
							Editorial pieces, built to last beyond a season.
						</h2>
						<p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
							A small collection of considered garments — sourced from European ateliers, cut in natural
							fibres, and finished by hand. We work with houses who care about provenance, fabric, and the
							people who make what we wear.
						</p>
						<p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
							Each piece is photographed in our gallery in soft natural light. Nothing is rushed.
						</p>
						<div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
							<div>
								<p className="font-display text-3xl font-light">42</p>
								<p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ateliers</p>
							</div>
							<div>
								<p className="font-display text-3xl font-light">16</p>
								<p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cities</p>
							</div>
							<div>
								<p className="font-display text-3xl font-light">2014</p>
								<p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Founded</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
