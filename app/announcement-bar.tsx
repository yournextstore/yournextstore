const messages = [
	"100% CLEAN, NON-IRRITATING",
	"NO ANIMAL TESTING",
	"FREE SHIPPING ON ALL U.S. ORDERS $200+",
];

export function AnnouncementBar() {
	const repeated = [...messages, ...messages, ...messages, ...messages];

	return (
		<div className="bg-foreground text-primary-foreground overflow-hidden">
			<div className="flex animate-marquee whitespace-nowrap py-2">
				{repeated.map((message, i) => (
					<span key={`msg-${i}`} className="mx-8 text-[11px] font-medium tracking-[0.15em] uppercase">
						{message}
					</span>
				))}
			</div>
		</div>
	);
}
