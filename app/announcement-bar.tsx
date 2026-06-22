const MESSAGES = [
	"Free shipping over $50",
	"New seasonal bars just dropped",
	"Bean-to-bar, made in small batches",
	"Subscribe & save 10%",
];

export function AnnouncementBar() {
	const items = [...MESSAGES, ...MESSAGES];
	return (
		<div className="bg-yns-green text-white overflow-hidden">
			<div className="relative flex whitespace-nowrap py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em]">
				<div className="yns-marquee flex shrink-0 items-center gap-12 pr-12">
					{items.map((msg, i) => (
						<span key={`msg-${i}`} className="flex items-center gap-12">
							<span>{msg}</span>
							<span aria-hidden="true" className="text-yns-yellow">
								★
							</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
