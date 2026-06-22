const accolades = [
	"Vogue — Editor's Pick",
	"The Cut — 100 Best of the Year",
	"NYT T Magazine",
	"Wallpaper* — Design Awards",
	"Dazed — Underground",
	"AnOther — Houses to Watch",
	"Cereal — Slow Object",
	"032c — Cult Status",
];

export function PressMarquee() {
	const doubled = [...accolades, ...accolades];
	return (
		<section className="relative border-y border-foreground/10 bg-ink py-7 overflow-hidden">
			<div className="marquee flex w-max gap-14 whitespace-nowrap">
				{doubled.map((line, i) => (
					<div
						key={`${line}-${i}`}
						className="flex items-center gap-14 text-[10px] tracking-microcaps text-foreground/55"
					>
						<span>{line}</span>
						<span className="font-serif-display text-base italic text-saffron/60">✦</span>
					</div>
				))}
			</div>
		</section>
	);
}
