import Image from "next/image";

export function About() {
	return (
		<section id="story" className="relative overflow-hidden bg-cream-paper">
			<div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:py-28">
				<div className="order-2 lg:order-1">
					<p className="divider-ornament">Our Heritage</p>
					<h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-[color:#0f2a3f] sm:text-5xl lg:text-[56px]">
						A recipe written by <span className="italic text-[color:#7c1f12]">three generations</span> of
						nonnas.
					</h2>
					<p className="mt-6 max-w-xl text-base leading-relaxed text-[color:#0f2a3f]/75 sm:text-lg">
						Our hot sauce begins where every great Italian story begins — in a sun-drenched courtyard, with a
						cast-iron pot, and a debate about the right amount of garlic. We tend the same chili plants our
						great-grandmother grew, hand-pick them at peak ripeness, and slow-simmer in copper kettles for
						twelve hours.
					</p>
					<p className="mt-4 max-w-xl text-base leading-relaxed text-[color:#0f2a3f]/75 sm:text-lg">
						No shortcuts. No preservatives. Just heat, history, and a little bit of theatre.
					</p>

					<dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[color:#0f2a3f]/10 pt-8">
						<div>
							<dt className="font-display text-3xl text-[color:#ee7a1a]">12 hrs</dt>
							<dd className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:#0f2a3f]/60">
								Slow simmer
							</dd>
						</div>
						<div>
							<dt className="font-display text-3xl text-[color:#ee7a1a]">100%</dt>
							<dd className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:#0f2a3f]/60">
								Italian-grown
							</dd>
						</div>
						<div>
							<dt className="font-display text-3xl text-[color:#ee7a1a]">1923</dt>
							<dd className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:#0f2a3f]/60">
								Original recipe
							</dd>
						</div>
					</dl>
				</div>

				<div className="relative order-1 lg:order-2">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[color:#0f2a3f] shadow-[0_30px_60px_-20px_rgba(15,42,63,0.45)]">
						<Image
							src="/scraped-0.jpg"
							alt="Italian still-life with hot sauce"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#0f2a3f]/40 via-transparent to-transparent" />
					</div>
					<div className="absolute -bottom-6 -left-6 hidden h-32 w-32 rotate-[-6deg] border border-[color:#0f2a3f]/10 bg-[color:#fdf8ec] p-4 shadow-xl md:block">
						<p className="font-display text-xs uppercase tracking-[0.2em] text-[color:#7c1f12]">
							Hand stamped
						</p>
						<p className="mt-2 font-display text-2xl italic text-[color:#0f2a3f]">N° 01</p>
						<p className="mt-1 text-[10px] text-[color:#0f2a3f]/60">Batch / Calabria</p>
					</div>
				</div>
			</div>
		</section>
	);
}
