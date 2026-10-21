// The home page's numbered value strip, stacked under the buy buttons.
const PROMISES = [
	{ title: "Seasonal stems", line: "Whatever is best this week" },
	{ title: "Hand-tied", line: "Wrapped in kraft paper" },
	{ title: "Secure checkout", line: "Delivery options at checkout" },
];

export function TrustBadges() {
	return (
		<ul className="border-t border-line">
			{PROMISES.map((promise, index) => (
				<li key={promise.title} className="flex items-center gap-[18px] border-b border-line py-3.5">
					<span aria-hidden="true" className="serif w-8 text-[1.5rem] font-semibold text-coral-text">
						{String(index + 1).padStart(2, "0")}
					</span>
					<p className="text-[0.7rem] leading-[1.7] text-muted-foreground">
						<b className="font-bold text-ink">{promise.title}</b>
						<br />
						{promise.line}
					</p>
				</li>
			))}
		</ul>
	);
}
