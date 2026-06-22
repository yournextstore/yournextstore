import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
					{/* Image — overhead empty ceramic bowls */}
					<div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto rounded-2xl overflow-hidden border border-border bg-[var(--sand)]/50">
						<Image
							src="/scraped-1.jpg"
							alt="Overhead view of empty stoneware bowls in warm cream tones"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
					</div>

					{/* Text card */}
					<div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-border bg-[var(--bone)] p-8 sm:p-10">
						<div>
							<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
								About Us
							</span>
							<h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground leading-[1.05]">
								Slow-made objects for a quieter home.
							</h2>
							<p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
								Your Next Store began in a small studio where a single potter and a stone wheel produced one
								bowl a day. Years later, we still partner with independent makers who share that same patience
								— choosing natural clay, honest glazes and unhurried craft over speed and volume.
							</p>
							<p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
								Every piece is shaped by hand, signed underneath, and sent out wrapped in unbleached paper. A
								reminder that the things we live with should outlast the season they arrived in.
							</p>
						</div>
						<YnsLink
							prefetch="eager"
							href="#products"
							className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-medium text-foreground border-b border-foreground/40 pb-1 w-fit hover:border-foreground transition-colors"
						>
							Read More
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
