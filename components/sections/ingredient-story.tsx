import Image from "next/image";
import { YnsLink } from "../yns-link";

export function IngredientStory() {
	return (
		<section className="bg-background relative">
			<div className="px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Macro botanical image */}
					<div className="lg:col-span-7 relative">
						<div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
							<Image
								src="/scraped-4.jpg"
								alt="Botanical macro study"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
							{/* annotated overlay */}
							<div className="absolute top-6 left-6 uppercase-display text-[10.5px] tracking-[0.22em] text-background bg-foreground/85 px-3 py-1.5 backdrop-blur">
								Botanical Index · 042
							</div>
						</div>
						{/* small data caption */}
						<div className="mt-4 flex items-start justify-between text-[11px] uppercase-display tracking-[0.18em] text-muted-foreground">
							<span>Camellia Sinensis · Green Tea</span>
							<span>Cold-extracted · 21°C</span>
						</div>
					</div>

					{/* Editorial paragraph */}
					<div className="lg:col-span-5">
						<p className="uppercase-display text-[10.5px] tracking-[0.24em] text-muted-foreground">
							The Science of Botanicals
						</p>
						<h2 className="mt-5 uppercase-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.05]">
							Pharmacology meets the herbarium.
						</h2>
						<div className="mt-7 space-y-5 text-foreground/75 leading-relaxed">
							<p>
								Every Your Next Store formulation begins inside the laboratory and ends in the field. We
								source single-origin actives — green tea polyphenols, mountain mint, glycerin from sugar beet
								— and translate them into clinically meaningful concentrations.
							</p>
							<p>
								No filler, no fragrance for fragrance&apos;s sake. Just the molecular precision your skin
								already recognises.
							</p>
						</div>

						{/* tiny ingredient ledger */}
						<dl className="mt-9 grid grid-cols-2 gap-y-4 gap-x-6 border-t border-border/70 pt-7">
							{[
								["Antioxidant index", "94.6%"],
								["Free of", "Sulfates · Parabens"],
								["Vegan", "Certified"],
								["pH calibrated", "5.5"],
							].map(([k, v]) => (
								<div key={k}>
									<dt className="uppercase-display text-[10px] tracking-[0.22em] text-muted-foreground">
										{k}
									</dt>
									<dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
								</div>
							))}
						</dl>

						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-9 inline-flex uppercase-display text-[11px] tracking-[0.22em] text-foreground border-b border-foreground pb-1 hover:text-foreground/70 transition-colors"
						>
							Read the formulation notes
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
