export function AnnouncementBar() {
	const messages = [
		"Spend $60 to get free shipping",
		"20G protein in every bite",
		"Real ingredients. No surprises.",
		"New: Lemon Shortbread is back in stock",
	];

	return (
		<div className="bg-foreground text-background text-xs tracking-wide">
			<div className="relative overflow-hidden">
				<div className="ticker-inner marquee">
					{[...messages, ...messages, ...messages, ...messages].map((msg, i) => (
						<span
							key={`announce-${i}-${msg}`}
							className="inline-flex items-center gap-3 px-6 py-2.5 whitespace-nowrap"
						>
							<span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-[var(--butter)]" />
							{msg}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
