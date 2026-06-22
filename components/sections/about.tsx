import Image from "next/image";

const stats = [
	{ value: "12+", label: "Bold Flavors" },
	{ value: "19K", label: "Happy Sippers" },
	{ value: "0", label: "Artificial Junk" },
];

export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-black">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left image */}
					<div className="lg:col-span-6">
						<div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#0d0d0d]">
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,193,7,0.18),transparent_55%)]"
							/>
							<Image
								src="/scraped-2.jpg"
								alt="Can submerged in cold splash"
								fill
								sizes="(max-width: 1024px) 100vw, 600px"
								className="object-cover"
							/>
							<div className="absolute bottom-4 left-4 right-4 yns-card-glass rounded-2xl p-4">
								<div className="flex items-center gap-3">
									<span className="h-2.5 w-2.5 rounded-full bg-[var(--color-yns-yellow)] shadow-[0_0_10px_var(--color-yns-yellow)]" />
									<p className="text-[11px] uppercase tracking-[0.18em] text-white/70">
										Brewed cold · Served cool
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right copy */}
					<div className="lg:col-span-6">
						<p className="text-[11px] uppercase tracking-[0.22em] text-white/40">About YNS</p>
						<h2 className="font-display mt-4 text-5xl sm:text-6xl leading-[0.95] text-white">
							Our Story:
							<br />
							Crafting <span className="text-[var(--color-yns-yellow)]">Cool Drink</span> Excellence
						</h2>
						<p className="mt-8 text-white/65 text-base sm:text-lg leading-relaxed max-w-xl">
							Passionate creators of cool drink experiences. We obsess over every bubble, every flavor and
							every nitro pour — so the only thing you have to focus on is the next sip.
						</p>
						<p className="mt-4 text-white/55 text-base leading-relaxed max-w-xl">
							From the first whisper of carbonation to that bold, smooth finish, every bottle is built for the
							moments you live for.
						</p>

						<dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
							{stats.map((s) => (
								<div key={s.label} className="border-l border-white/10 pl-4">
									<dt className="font-display text-3xl sm:text-4xl text-white">{s.value}</dt>
									<dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/50">{s.label}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
