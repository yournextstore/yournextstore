const ITEMS = [
	"Build Your Set & Enjoy Exclusive Savings",
	"Free Shipping on Bundles",
	"Up to 30% Off When You Bundle 4+",
	"Free Returns on First Orders",
];

export function AnnouncementBar() {
	const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

	return (
		<div className="bg-[#14111c] text-[#f1ecf8] overflow-hidden">
			<div className="relative flex whitespace-nowrap py-2.5">
				<div className="flex shrink-0 animate-marquee items-center">
					{loop.map((item, i) => (
						<span
							key={`${item}-${i}`}
							className="mx-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em]"
						>
							{item}
							<span aria-hidden className="text-[#f2c14a]">
								◆
							</span>
						</span>
					))}
				</div>
				<div aria-hidden className="flex shrink-0 animate-marquee items-center">
					{loop.map((item, i) => (
						<span
							key={`d-${item}-${i}`}
							className="mx-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em]"
						>
							{item}
							<span className="text-[#f2c14a]">◆</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
