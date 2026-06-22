import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-bone">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
					{/* Left: large editorial image */}
					<div className="lg:col-span-7 relative">
						<div className="relative overflow-hidden rounded-[24px] ring-1 ring-border/60 aspect-[5/6] sm:aspect-[4/5] lg:aspect-[5/6]">
							<Image
								src="/scraped-3.jpg"
								alt="Editorial interior — Mediterranean villa"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
							<div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-bone/90 px-3 py-1.5 text-[10px] tracking-[0.32em] uppercase text-charcoal">
								The Wedding Edit
							</div>
							<div className="absolute bottom-6 right-6 text-bone text-[10px] tracking-[0.32em] uppercase">
								Featured story
							</div>
						</div>
					</div>

					{/* Right: copy + secondary image */}
					<div className="lg:col-span-5 flex flex-col justify-between gap-10">
						<div>
							<p className="text-[11px] tracking-[0.36em] uppercase text-bronze">
								For the moments that matter
							</p>
							<h2 className="mt-5 font-display text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.05]">
								Dressed for the
								<br />
								<span className="italic text-bronze">slow celebrations.</span>
							</h2>
							<p className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-md">
								Heirloom-quality tailoring and weightless silks for the people you stand beside. Each piece is
								made-to-order from our atelier in small, considered runs — never on a season clock.
							</p>
							<ul className="mt-7 space-y-3 text-sm text-foreground/80">
								{[
									{ k: "01", v: "Hand-finished in our family-run atelier" },
									{ k: "02", v: "Natural fibres — linen, silk, fine wool" },
									{ k: "03", v: "Lifetime alterations on every garment" },
								].map(({ k, v }) => (
									<li key={k} className="flex items-baseline gap-4">
										<span className="font-display italic text-bronze text-base shrink-0">{k}</span>
										<span className="text-pretty">{v}</span>
									</li>
								))}
							</ul>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="mt-8 inline-flex items-center gap-2 text-sm tracking-[0.22em] uppercase font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors group"
							>
								Discover the edit
								<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</YnsLink>
						</div>

						{/* Stacked image card */}
						<div className="relative overflow-hidden rounded-[20px] ring-1 ring-border/60 aspect-[16/10]">
							<Image
								src="/scraped-1.jpg"
								alt="Editorial fabric detail"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" />
							<div className="absolute inset-0 p-6 flex flex-col justify-between">
								<span className="text-bone/85 text-[10px] tracking-[0.32em] uppercase">Atelier journal</span>
								<div>
									<p className="font-display text-bone text-xl sm:text-2xl leading-tight max-w-xs">
										On linen, light, and the art of doing less.
									</p>
									<p className="mt-2 text-bone/70 text-xs">Read · 4 min</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
