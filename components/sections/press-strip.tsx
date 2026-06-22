const press = [
	{ name: "VOGUE", quote: "An entirely new category of performance beauty." },
	{ name: "ELLE", quote: "Doesn't budge — even when you don't want to stop." },
	{ name: "Allure", quote: "The setting spray that finally lives up to the hype." },
	{ name: "Harper's Bazaar", quote: "Cinematic, intelligent, unapologetic." },
	{ name: "Cosmopolitan", quote: "Engineered for women who don't sit still." },
	{ name: "W Magazine", quote: "Editorial finish meets athletic durability." },
];

export function PressStrip() {
	return (
		<section className="border-y border-border/60 bg-[oklch(0.94_0.013_75)]">
			<div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
				<p className="eyebrow text-center text-bronze">As Seen In</p>
				<div className="mt-8 overflow-hidden">
					<div className="marquee-track flex w-max gap-16">
						{[...press, ...press].map((p, i) => (
							<div key={`${p.name}-${i}`} className="flex flex-shrink-0 items-center gap-6">
								<span className="font-display text-2xl font-light tracking-[0.18em] text-ink/60 sm:text-3xl">
									{p.name}
								</span>
								<span className="hidden max-w-xs text-xs italic text-muted-foreground sm:inline">
									“{p.quote}”
								</span>
								<span className="text-bronze/40">◆</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
