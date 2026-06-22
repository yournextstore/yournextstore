import Image from "next/image";

const pillars = [
	{
		title: "Our production",
		image: "/scraped-3.jpg",
		body: "Frames built to last in oak, ash and FSC-certified hardwoods, finished by hand in our European workshop.",
		href: "/products",
	},
	{
		title: "Our design",
		image: "/scraped-2.jpg",
		body: "Quiet, considered silhouettes that age with grace. Modular by intent — adapted to the way you live now.",
		href: "/products",
	},
	{
		title: "Our sustainability",
		image: "/scraped-4.jpg",
		body: "Natural fibres, water-based finishes, repairable parts. Every sofa is engineered to be re-upholstered, not replaced.",
		href: "/products",
	},
];

export function EditorialParagraph() {
	return (
		<section className="bg-paper-grain">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				<p className="eyebrow text-[var(--clay)] mb-5">The series</p>
				<p className="font-display text-2xl sm:text-3xl leading-[1.45] text-foreground/85">
					The Applaryd series is made up of individual sections that can be used to create different
					combinations to suit your needs — and ready to change as your family grows. A complete solution can
					always be supplemented with new sections.
				</p>
				<div className="mt-10 flex items-center justify-center gap-3 text-foreground/40">
					<span className="h-px w-10 bg-current" />
					<span className="font-display italic text-sm">— since 2014</span>
					<span className="h-px w-10 bg-current" />
				</div>
			</div>
		</section>
	);
}

export function About() {
	return (
		<section id="about" className="bg-cream-grain">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-[1fr_auto] items-end gap-10 mb-12">
					<div>
						<p className="eyebrow text-[var(--clay)] mb-4">House philosophy</p>
						<h2 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground max-w-xl leading-[1.05]">
							A house of considered making, from sketch to stitch.
						</h2>
					</div>
					<p className="text-sm tracking-wide text-foreground/55 max-w-xs lg:text-right">
						Three principles that shape every piece we send into a home — the workshop, the drawing board, and
						the world it returns to.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{pillars.map((pillar, idx) => (
						<article
							key={pillar.title}
							className="group bg-background rounded-sm overflow-hidden border hairline shadow-[0_1px_0_rgba(26,26,26,0.04)]"
						>
							<div className="relative aspect-[5/4] overflow-hidden bg-[var(--cream-deep)]">
								<Image
									src={pillar.image}
									alt={pillar.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
								/>
								<div className="absolute top-4 left-4 font-display text-xs text-background/80 bg-foreground/30 backdrop-blur-sm rounded-full px-2.5 py-1">
									0{idx + 1}
								</div>
							</div>
							<div className="p-7 lg:p-8">
								<h3 className="font-display text-2xl text-foreground">{pillar.title}</h3>
								<p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/65">{pillar.body}</p>
								<div className="mt-5 inline-flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-[var(--forest)] border-b border-[var(--forest)]/30 pb-1 group-hover:border-[var(--forest)] transition-colors">
									Read more
									<span aria-hidden="true">→</span>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
