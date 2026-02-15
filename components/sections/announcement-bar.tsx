export function AnnouncementBar() {
	const messages = [
		"100% CLEAN, NON-IRRITATING",
		"NO ANIMAL TESTING",
		"FREE SHIPPING ON ALL U.S. ORDERS $200+",
	];

	return (
		<div className="bg-foreground text-primary-foreground overflow-hidden">
			<div className="flex animate-marquee whitespace-nowrap py-2">
				{Array.from({ length: 6 }).map((_, groupIdx) =>
					messages.map((msg, msgIdx) => (
						<span
							key={`${groupIdx}-${msgIdx}`}
							className="mx-8 text-xs font-medium tracking-widest uppercase"
						>
							{msg}
						</span>
					)),
				)}
			</div>
		</div>
	);
}
