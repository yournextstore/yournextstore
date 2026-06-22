export function Hero() {
	return (
		<section className="muse-dove-band relative overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 opacity-[0.18] mix-blend-multiply">
				<svg
					className="w-full h-full"
					viewBox="0 0 1200 600"
					preserveAspectRatio="xMidYMid slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>backdrop</title>
					<defs>
						<radialGradient id="g1" cx="30%" cy="40%" r="60%">
							<stop offset="0%" stopColor="#c9b8c7" stopOpacity="0.9" />
							<stop offset="100%" stopColor="#c9b8c7" stopOpacity="0" />
						</radialGradient>
						<radialGradient id="g2" cx="75%" cy="80%" r="60%">
							<stop offset="0%" stopColor="#d96a52" stopOpacity="0.4" />
							<stop offset="100%" stopColor="#d96a52" stopOpacity="0" />
						</radialGradient>
					</defs>
					<rect width="1200" height="600" fill="url(#g1)" />
					<rect width="1200" height="600" fill="url(#g2)" />
				</svg>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-14 sm:pb-20">
				<div className="text-center muse-fade-up">
					<p className="text-[11px] uppercase tracking-[0.4em] text-foreground/60 mb-6">
						Est. <span className="inline-block">202X</span> &nbsp;·&nbsp; A laundry ritual
					</p>

					<h1 className="font-serif text-foreground leading-[0.86] tracking-[-0.025em]">
						<span className="block text-[16vw] sm:text-[15vw] lg:text-[13.5rem] font-light">
							Your{" "}
							<span className="italic font-light" style={{ fontFamily: "var(--font-serif)" }}>
								Next
							</span>{" "}
							Store
						</span>
					</h1>

					<p className="mt-5 text-sm sm:text-base text-foreground/70 max-w-xl mx-auto">
						Mess-free, enzyme-powered laundry detergent sheets in signature scents.
					</p>
				</div>
			</div>

			<div className="relative h-10 sm:h-14 lg:h-20 bg-gradient-to-b from-transparent to-background/60" />
		</section>
	);
}
