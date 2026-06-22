export function AnnouncementBar() {
	const messages = [
		"Free shipping on orders over $40",
		"New: Cheese Tease nutritional blend",
		"Plant-based, organic, non-GMO",
		"As seen in Bon Appetit & Vogue",
	];
	const loop = [...messages, ...messages, ...messages];
	return (
		<div className="overflow-hidden border-b border-[#1b2a2e]/10 bg-[#1b2a2e] text-[#fbe9d7]">
			<div className="flex whitespace-nowrap plantchi-marquee py-2.5 text-[11px] font-medium uppercase tracking-[0.18em]">
				{loop.map((m, i) => (
					<span key={`${m}-${i}`} className="inline-flex items-center gap-3 px-6">
						<span aria-hidden="true" className="text-[#f5a623]">
							✿
						</span>
						{m}
					</span>
				))}
			</div>
		</div>
	);
}
