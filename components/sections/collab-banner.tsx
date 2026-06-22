export function CollabBanner() {
	const phrase = "Your Next Store × Studio Rayan — Selected Summer 2026";
	const items = Array.from({ length: 6 }, () => phrase);
	return (
		<section className="bg-foreground text-background border-y-2 border-foreground overflow-hidden">
			<div className="yns-marquee yns-marquee-fast py-5 sm:py-7">
				{items.map((t, i) => (
					<span
						key={`${t}-${i}`}
						className="font-display uppercase text-[7vw] sm:text-[5vw] lg:text-[3.5vw] leading-none tracking-tight whitespace-nowrap flex items-center gap-6"
					>
						<span className="text-background">{t.split(" — ")[0]}</span>
						<span className="bg-background/15 px-3 py-1 text-background/80">{t.split(" — ")[1]}</span>
						<span className="text-background/40">●</span>
					</span>
				))}
			</div>
		</section>
	);
}
