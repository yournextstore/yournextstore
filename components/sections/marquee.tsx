const ITEMS = [
	"Hand-finished",
	"FSC-certified timber",
	"Plant-based pigments",
	"Signed by the maker",
	"Built to outlast",
	"Made in small batches",
] as const;

export function Marquee() {
	const sequence = [...ITEMS, ...ITEMS];
	return (
		<section className="bg-[color:var(--yns-ink)] text-[color:var(--yns-cream)] py-5 overflow-hidden yns-marquee">
			<div className="yns-marquee-track flex w-max gap-12 whitespace-nowrap">
				{sequence.map((item, i) => (
					<div key={i} className="flex items-center gap-12">
						<span className="font-display text-xl sm:text-2xl tracking-tight uppercase">{item}</span>
						<span className="text-[color:var(--yns-terracotta)] text-xl">✷</span>
					</div>
				))}
			</div>
		</section>
	);
}
