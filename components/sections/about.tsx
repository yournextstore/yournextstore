export function About() {
	return (
		<section id="about" className="bg-background border-b-2 border-foreground">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
				<div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
					<div className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/60">
						About / 01
						<br />
						Your Next Store
					</div>
					<div>
						<h2 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.95] text-foreground">
							We don't follow the rules
							<br />
							of fashion — <span className="text-foreground/30">we rewrite them.</span>
						</h2>
						<div className="mt-8 grid sm:grid-cols-2 gap-8 max-w-3xl">
							<p className="text-base text-muted-foreground leading-relaxed">
								YNS is a multi-brand storefront engineered for the next generation of shoppers. Every piece —
								from chunky platforms to charm kits — is sourced with one rule: it has to feel like you, not
								someone else.
							</p>
							<p className="text-base text-muted-foreground leading-relaxed">
								We work with independent makers, drop new capsules every week, and ship anywhere. No
								membership. No catch. Just good stuff, fast.
							</p>
						</div>

						<div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl">
							{[
								{ label: "Drops / Year", value: "52" },
								{ label: "Independent Brands", value: "180+" },
								{ label: "Avg. Delivery", value: "3 days" },
							].map((stat) => (
								<div key={stat.label} className="border-2 border-foreground p-4 sm:p-5 bg-background">
									<div className="font-display text-2xl sm:text-3xl text-foreground">{stat.value}</div>
									<div className="mt-1 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/60">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
