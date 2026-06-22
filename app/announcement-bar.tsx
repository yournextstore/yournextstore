const items = [
	"FREE SHIPPING ON ORDERS OVER $50",
	"30G PROTEIN PER PINT",
	"NEW DROP — VANILLA BEAN IS BACK",
	"REAL INGREDIENTS · NO FAKE STUFF",
	"SHIPPING NATIONWIDE",
	"SUBSCRIBE & SAVE 15%",
];

export function AnnouncementBar() {
	const loop = [...items, ...items];
	return (
		<div className="bg-[var(--yns-cyan)] text-black overflow-hidden">
			<div className="flex whitespace-nowrap yns-marquee py-2.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.15em]">
				{loop.map((text, i) => (
					<span key={`${text}-${i}`} className="flex items-center gap-3 px-6 shrink-0">
						<span>{text}</span>
						<span aria-hidden className="text-black/50">
							→
						</span>
					</span>
				))}
			</div>
		</div>
	);
}
