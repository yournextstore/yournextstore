import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-[var(--brand-cream)]">
			<div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 sm:py-28 lg:px-10 lg:py-32">
				<div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
					<div className="order-2 lg:order-1">
						<p className="font-mono-ed text-[10px] uppercase tracking-[0.32em] text-[var(--brand-ember)]">
							Our story
						</p>
						<h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--brand-ink)]">
							Started in a small kitchen, on a stubborn idea.
						</h2>
						<p className="mt-6 max-w-md font-mono-ed text-[12px] leading-relaxed text-[var(--brand-ink)]/65">
							That a sauce can be fast and honest at the same time. That a label can read like a recipe. That
							nine words is enough.
						</p>
						<p className="mt-4 max-w-md font-mono-ed text-[12px] leading-relaxed text-[var(--brand-ink)]/65">
							Every bottle is cold-blended, lightly cooked, and shipped in flat-pack mailers designed to fit
							through a standard mail slot — because convenience shouldn't cost the planet a box.
						</p>
						<dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--brand-ink)]/10 pt-8">
							{[
								{ k: "INGREDIENTS / BOTTLE", v: "≤ 9" },
								{ k: "SHELF LIFE / OPEN", v: "30 d" },
								{ k: "MILES FROM FARM", v: "< 200" },
							].map((stat) => (
								<div key={stat.k}>
									<dt className="font-mono-ed text-[9px] uppercase tracking-[0.18em] text-[var(--brand-ink)]/50">
										{stat.k}
									</dt>
									<dd className="mt-2 font-display text-2xl font-medium tracking-tight text-[var(--brand-ink)]">
										{stat.v}
									</dd>
								</div>
							))}
						</dl>
					</div>
					<div className="relative order-1 aspect-[4/5] overflow-hidden lg:order-2">
						<Image
							src="/scraped-4.jpg"
							alt="A still life of ingredients and a single sauce bottle in afternoon light"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0"
							style={{
								background: "linear-gradient(180deg, transparent 60%, rgba(245,240,225,0.25) 100%)",
							}}
						/>
						{/* Editorial caption */}
						<div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
							<p className="font-mono-ed text-[10px] uppercase tracking-[0.22em] text-[var(--brand-cream)] mix-blend-difference">
								Plate 12 — House Drop on charred bread
							</p>
							<p className="font-mono-ed text-[10px] tracking-[0.22em] text-[var(--brand-cream)] mix-blend-difference">
								— Vol. 01
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
