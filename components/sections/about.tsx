import Image from "next/image";

export function About() {
	return (
		<section id="about" className="bg-[var(--yns-cream)]">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
					<div className="relative aspect-[4/5] bg-[var(--yns-red)] overflow-hidden">
						<Image
							src="/scraped-1.jpg"
							alt="founder portrait in red studio light"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover mix-blend-multiply"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-[var(--yns-oxblood)]/40 via-transparent to-transparent" />
						<div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white/90 text-[10px] uppercase tracking-[0.3em]">
							<span>p., founder</span>
							<span>brooklyn / 3:14 am</span>
						</div>
					</div>

					<div className="flex flex-col justify-between">
						<div>
							<span className="text-[10px] uppercase tracking-[0.3em] text-[var(--yns-red)]">
								a letter from the founder
							</span>
							<blockquote className="mt-6 font-[family-name:var(--font-display)] italic text-[var(--yns-ink)] text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
								&ldquo;i started this brand at 4 a.m., crying in a bathrobe, googling
								<span className="text-[var(--yns-red)]"> &lsquo;why am i still awake.&rsquo;</span> turns out,
								the supplement aisle was lying to me. so we made our own.&rdquo;
							</blockquote>
							<p className="mt-8 max-w-md text-[var(--yns-ink)]/70 text-sm sm:text-base leading-relaxed lowercase">
								your next store is for the chronically tired, the over-thinkers, the night shift, the new
								parents, the ballerinas, the academics — anyone who deserves a softer landing into the dark.
							</p>
						</div>

						<div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 border-t border-[var(--yns-ink)]/15 pt-8">
							<div>
								<div className="font-[family-name:var(--font-display)] italic text-4xl sm:text-5xl text-[var(--yns-red)] tabular-nums">
									8.4h
								</div>
								<p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--yns-ink)]/70">
									avg. sleep gained
								</p>
							</div>
							<div>
								<div className="font-[family-name:var(--font-display)] italic text-4xl sm:text-5xl text-[var(--yns-red)] tabular-nums">
									42k
								</div>
								<p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--yns-ink)]/70">
									waitlist members
								</p>
							</div>
							<div>
								<div className="font-[family-name:var(--font-display)] italic text-4xl sm:text-5xl text-[var(--yns-red)] tabular-nums">
									0
								</div>
								<p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--yns-ink)]/70">
									melatonin hangovers
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
