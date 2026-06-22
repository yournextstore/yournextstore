const messages = [
	"Orders Over $80 Get Ship Free",
	"100% Plant-Based, Always",
	"Real Fruits, Nuts & Superfoods",
	"No Preservatives. No Added Sugar.",
];

export function AnnouncementBar() {
	const loop = [...messages, ...messages, ...messages, ...messages];
	return (
		<div className="relative overflow-hidden bg-brand-orange text-white">
			<div className="flex w-max yns-marquee whitespace-nowrap py-2 text-[12px] font-medium uppercase tracking-[0.18em]">
				{loop.map((msg, i) => (
					<span key={`msg-${i}`} className="flex items-center gap-6 px-6">
						<span aria-hidden className="inline-block h-1 w-1 rounded-full bg-white/80" />
						<span>{msg}</span>
					</span>
				))}
			</div>
		</div>
	);
}
