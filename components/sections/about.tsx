import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-[color:var(--yns-cream-soft)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<div className="lg:col-span-5 order-2 lg:order-1">
						<div className="relative aspect-[4/5] overflow-hidden rounded-sm">
							<Image
								src="/scraped-2.jpg"
								alt="Sculptural wooden object on cream pedestal"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
						</div>
					</div>

					<div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
						<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">Our studio</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight text-foreground">
							Objects with
							<br />a long life.
						</h2>
						<div className="mt-8 space-y-5 text-[16px] leading-relaxed text-foreground/80 max-w-xl">
							<p>
								We started in a small barn workshop with three carpenters and a shared belief: children
								deserve toys made the way furniture used to be made — slowly, by hand, from materials that
								outlast the trend cycle.
							</p>
							<p>
								Each piece is turned, sanded and finished by a single maker, then signed before it leaves the
								bench. Our pigments are plant-based, our timbers FSC-certified, our offcuts heat the workshop
								in winter.
							</p>
						</div>

						<dl className="mt-12 grid grid-cols-3 gap-6 border-t border-foreground/15 pt-8">
							<div>
								<dt className="yns-eyebrow text-muted-foreground">Founded</dt>
								<dd className="mt-2 font-display text-2xl sm:text-3xl text-foreground">2014</dd>
							</div>
							<div>
								<dt className="yns-eyebrow text-muted-foreground">Workshops</dt>
								<dd className="mt-2 font-display text-2xl sm:text-3xl text-foreground">3</dd>
							</div>
							<div>
								<dt className="yns-eyebrow text-muted-foreground">Makers</dt>
								<dd className="mt-2 font-display text-2xl sm:text-3xl text-foreground">17</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
