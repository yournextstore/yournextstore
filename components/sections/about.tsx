import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-parchment">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">
					{/* Image plate */}
					<div className="col-span-12 md:col-span-7 relative">
						<div className="relative aspect-[5/4] rounded-md overflow-hidden border border-border/60 bg-card">
							<Image
								src="/scraped-2.jpg"
								alt="Studio interior with sculptural chair"
								fill
								sizes="(max-width: 768px) 100vw, 60vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0"
								style={{
									background:
										"linear-gradient(115deg, oklch(1 0 0 / 0.15) 0%, transparent 40%, oklch(0.18 0.005 60 / 0.2) 100%)",
								}}
							/>
							<div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-sm font-grotesk text-[10px] uppercase tracking-eyebrow text-foreground">
								<span className="block h-1.5 w-1.5 rounded-full bg-accent" />
								archive №01
							</div>
						</div>
						{/* Floating bracket ornament */}
						<div
							aria-hidden="true"
							className="absolute -top-6 -left-2 font-editorial italic text-5xl text-accent/40 select-none"
						>
							(
						</div>
					</div>

					{/* Copy */}
					<div className="col-span-12 md:col-span-5">
						<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground mb-6 flex items-center gap-3">
							<span aria-hidden className="block h-px w-8 bg-foreground" />
							our story
						</div>
						<h2 className="font-editorial italic font-light text-5xl md:text-6xl leading-[0.95] tracking-tight text-foreground">
							A quiet
							<br />
							<span className="not-italic font-normal">reverence</span>
							<br />
							for the makers.
						</h2>
						<p className="mt-8 font-grotesk text-sm leading-relaxed text-muted-foreground max-w-md">
							Your Next Store is a small editorial gallery — a stand for sculptural plywood, hand-polished
							brass and the patient hands behind them. We sell what we&apos;d keep for ourselves.
						</p>
						<p className="mt-4 font-grotesk text-sm leading-relaxed text-muted-foreground max-w-md">
							Each piece is selected with the maker named, the material disclosed, and the year the brief was
							first drawn. Nothing trendy. Nothing fast.
						</p>

						<dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
							<div>
								<dt className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
									since
								</dt>
								<dd className="mt-1 font-editorial italic text-3xl text-foreground">1955</dd>
							</div>
							<div>
								<dt className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
									makers
								</dt>
								<dd className="mt-1 font-editorial italic text-3xl text-foreground">42</dd>
							</div>
							<div>
								<dt className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
									archive
								</dt>
								<dd className="mt-1 font-editorial italic text-3xl text-foreground">№07</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
