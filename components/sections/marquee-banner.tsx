export function MarqueeBanner() {
	const text = "FREE SHIPPING FROM $100  \u2014  FAST INTERNATIONAL DELIVERY  \u2014  14 DAYS RETURN POLICY";

	return (
		<div className="overflow-hidden bg-secondary py-3 border-y border-border">
			<div className="animate-marquee flex whitespace-nowrap">
				{Array.from({ length: 4 }).map((_, i) => (
					<span
						key={`marquee-${i}`}
						className="mx-8 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light"
					>
						{text}
					</span>
				))}
			</div>
		</div>
	);
}
