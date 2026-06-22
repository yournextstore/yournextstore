import Image from "next/image";
import { YnsLink } from "../yns-link";

const blocks = [
	{
		eyebrow: "Nightly ritual",
		title: "A pour-and-sip moment that signals it’s time to rest.",
		copy: "Stirred into a small glass of water, our nighttime elixir is a quiet bookmark between the day you finished and the sleep you deserve. Lightly tart, gently floral, free of melatonin and sugar.",
		notes: ["Magnesium glycinate", "L-theanine", "Passionflower"],
		image: "/scraped-1.jpg",
		alt: "Frosted glass tumbler of a pale lavender elixir on marble",
		cta: { label: "Shop the elixir", href: "/products" },
		reverse: false,
	},
	{
		eyebrow: "Apothecary blend",
		title: "Botanicals worth steeping in.",
		copy: "We work alongside herbalists and clinical formulators to source ingredients in their fullest form — never isolated, never overworked. Every batch is third-party tested and traceable to the field.",
		notes: ["Ashwagandha root", "Reishi", "Chamomile"],
		image: "/scraped-2.jpg",
		alt: "Macro photograph of adaptogenic botanicals on raw stone",
		cta: { label: "Explore the blend", href: "/products" },
		reverse: true,
	},
];

export function FeatureBlocks() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-24 sm:space-y-32">
				{blocks.map((block) => (
					<div
						key={block.title}
						className={`grid items-center gap-10 lg:gap-16 lg:grid-cols-2 ${block.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
					>
						<div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-sm">
							<Image
								src={block.image}
								alt={block.alt}
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-foreground/10" />
						</div>
						<div className="max-w-lg lg:px-4">
							<p className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-5">
								— {block.eyebrow} —
							</p>
							<h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-foreground">
								{block.title}
							</h2>
							<p className="mt-5 text-base leading-relaxed text-muted-foreground">{block.copy}</p>
							<ul className="mt-6 flex flex-wrap gap-2">
								{block.notes.map((note) => (
									<li
										key={note}
										className="px-3 py-1.5 rounded-full border border-border bg-cream text-[11px] tracking-wide uppercase text-foreground/75"
									>
										{note}
									</li>
								))}
							</ul>
							<YnsLink
								prefetch={"eager"}
								href={block.cta.href}
								className="mt-8 inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-primary-foreground text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-burgundy-deep transition-colors"
							>
								{block.cta.label}
							</YnsLink>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
