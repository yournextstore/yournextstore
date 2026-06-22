import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-[var(--color-bone)]/40 border-y border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Left – two stacked editorial frames */}
					<div className="lg:col-span-5 grid grid-cols-2 gap-4">
						<div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary editorial-float">
							<Image
								src="/scraped-2.jpg"
								alt="Studio detail — material study"
								fill
								sizes="(min-width: 1024px) 18vw, 40vw"
								className="object-cover"
							/>
						</div>
						<div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary mt-12">
							<Image
								src="/scraped-3.jpg"
								alt="Workshop — laminated veneer"
								fill
								sizes="(min-width: 1024px) 18vw, 40vw"
								className="object-cover"
							/>
						</div>
					</div>

					{/* Right – copy */}
					<div className="lg:col-span-7 lg:pl-8">
						<p className="editorial-eyebrow text-muted-foreground">Chapter One · Manifesto</p>
						<h2 className="mt-4 font-display italic text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] tracking-tight">
							A patient pursuit of <span className="text-[var(--color-rust)]">quiet</span> design.
						</h2>
						<div className="mt-8 grid sm:grid-cols-2 gap-8 text-sm leading-relaxed text-muted-foreground">
							<p>
								Your Next Store partners with workshops who treat material as a collaborator — bending
								laminated beech, hand-finishing brass, weaving wool the slow way. Every object is photographed
								in the same studio light so what arrives is what you saw.
							</p>
							<p>
								Nothing here is seasonal. The pieces in this catalog were either made decades ago or designed
								to be picked up decades from now. We hope the difference is invisible.
							</p>
						</div>
						<dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/70 pt-8">
							{[
								{ k: "Workshops", v: "23" },
								{ k: "Pieces", v: "180+" },
								{ k: "Countries", v: "11" },
							].map((stat) => (
								<div key={stat.k}>
									<dt className="editorial-eyebrow text-muted-foreground">{stat.k}</dt>
									<dd className="mt-2 font-display italic text-4xl text-foreground">{stat.v}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
