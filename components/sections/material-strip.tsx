import Image from "next/image";
import { YnsLink } from "../yns-link";

const swatches = [
	{ name: "Caramel", note: "natural oak laminate", color: "oklch(0.72 0.075 65)" },
	{ name: "Walnut", note: "deep stained shell", color: "oklch(0.46 0.085 50)" },
	{ name: "Safety", note: "limited edition №07", color: "oklch(0.71 0.165 50)" },
	{ name: "Bone", note: "matte powder coat", color: "oklch(0.92 0.015 75)" },
	{ name: "Ink", note: "high-gloss lacquer", color: "oklch(0.22 0.01 60)" },
];

export function MaterialStrip() {
	return (
		<section id="archive" className="relative bg-background overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-12 gap-6 lg:gap-10">
					{/* Left: editorial copy */}
					<div className="col-span-12 md:col-span-5 md:sticky md:top-24 md:self-start">
						<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground mb-6 flex items-center gap-3">
							<span aria-hidden className="block h-px w-8 bg-foreground" />
							finishes
						</div>
						<h2 className="font-editorial italic font-light text-5xl md:text-6xl leading-[0.95] tracking-tight text-foreground">
							Five
							<br />
							<span className="not-italic font-normal">honest</span>
							<br />
							<span>materials.</span>
						</h2>
						<p className="mt-6 font-grotesk text-sm leading-relaxed text-muted-foreground max-w-md">
							Every shell is bent in seven layers, sanded by hand, then finished in one of five honest
							treatments. We hold the samples in the studio — and ship them on request.
						</p>
						<YnsLink
							href="/products"
							prefetch="eager"
							className="mt-8 inline-flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-eyebrow text-foreground border-b border-foreground/70 pb-1 hover:gap-3 transition-all"
						>
							browse the catalogue
							<span aria-hidden>→</span>
						</YnsLink>
					</div>

					{/* Right: swatches + collection card */}
					<div className="col-span-12 md:col-span-7">
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{swatches.map((swatch, i) => (
								<figure key={swatch.name} className="group relative">
									<div
										className="aspect-square rounded-md border border-border/60 transition-transform duration-500 group-hover:scale-[1.02]"
										style={{ background: swatch.color }}
									/>
									<figcaption className="mt-3 flex items-baseline justify-between gap-2">
										<div>
											<div className="font-editorial italic text-base text-foreground">{swatch.name}</div>
											<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
												{swatch.note}
											</div>
										</div>
										<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
											{String(i + 1).padStart(2, "0")}
										</div>
									</figcaption>
								</figure>
							))}
							{/* Featured collection card */}
							<YnsLink
								href="/products"
								prefetch="eager"
								className="group relative aspect-square rounded-md overflow-hidden border border-border/60 bg-foreground text-background"
							>
								<Image
									src="/scraped-4.jpg"
									alt="Studio interior"
									fill
									sizes="(max-width: 768px) 50vw, 25vw"
									className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.05]"
								/>
								<div
									className="absolute inset-0"
									style={{
										background: "linear-gradient(180deg, transparent 40%, oklch(0.18 0.005 60 / 0.85) 100%)",
									}}
								/>
								<div className="absolute inset-x-3 bottom-3">
									<div className="font-editorial italic text-lg leading-tight">All Editions</div>
									<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-background/70 mt-0.5">
										browse →
									</div>
								</div>
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
