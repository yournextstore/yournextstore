import Image from "next/image";
import { YnsLink } from "../yns-link";

export function AuthorSpotlight() {
	return (
		<section className="relative bg-background overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
					<div className="lg:col-span-6 relative">
						<div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
							{/* color block behind */}
							<div
								aria-hidden
								className="absolute -left-4 -top-4 w-full h-full rounded-lg border-2 border-ink"
								style={{ background: "var(--chartreuse)" }}
							/>
							<div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-ink bg-cream-dark">
								<Image
									src="/scraped-2.jpg"
									alt="In the studio"
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
								<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-cream">
									<span className="text-[11px] tracking-[0.22em] uppercase font-semibold">
										From the studio
									</span>
									<span className="font-display italic text-2xl">vt.</span>
								</div>
							</div>
						</div>
					</div>

					<div className="lg:col-span-6">
						<span className="inline-block text-[11px] tracking-[0.22em] uppercase font-semibold text-cobalt mb-6">
							— Curator&rsquo;s note
						</span>
						<h2 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02] font-black tracking-tight text-foreground">
							A small bookshop with{" "}
							<span className="italic font-light" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
								big questions
							</span>{" "}
							on every shelf.
						</h2>
						<p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
							Our shop is curated by a rotating cast of writers, designers, and makers — people who use books
							like maps. This season&rsquo;s shelf is co-curated by Vicki Tan, whose work on noticing and
							decision-making sits at the heart of everything we stock.
						</p>
						<dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
							<div>
								<dt className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Titles</dt>
								<dd className="font-display text-3xl font-black text-foreground mt-1">240+</dd>
							</div>
							<div>
								<dt className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Imprints</dt>
								<dd className="font-display text-3xl font-black text-foreground mt-1">38</dd>
							</div>
							<div>
								<dt className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Curators</dt>
								<dd className="font-display text-3xl font-black text-foreground mt-1">12</dd>
							</div>
						</dl>
						<YnsLink
							prefetch="eager"
							href="/products"
							className="mt-10 inline-flex items-center gap-2 h-12 px-7 bg-foreground text-background rounded-full text-sm font-semibold tracking-[0.18em] uppercase hover:bg-cobalt transition-colors"
						>
							Meet the shelf
							<span>→</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
