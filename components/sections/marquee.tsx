const PHRASES = ["Dippable", "Spreadable", "Infinitely Enjoyable"];

export function Marquee({
	tone = "light",
	separator = "✦",
}: {
	tone?: "light" | "dark";
	separator?: string;
}) {
	const isLight = tone === "light";
	const items = Array.from({ length: 8 }).flatMap(() => PHRASES);

	return (
		<div
			className={
				isLight
					? "border-y border-ink/10 bg-cream py-4 overflow-hidden"
					: "bg-ink text-cream py-4 overflow-hidden"
			}
		>
			<div className="flex whitespace-nowrap yns-marquee" aria-hidden="true">
				<div className="flex shrink-0 items-center gap-6 pr-6">
					{items.map((phrase, i) => (
						<span
							key={`a-${phrase}-${i.toString()}`}
							className="flex items-center gap-6 text-[13px] sm:text-sm font-semibold uppercase tracking-[0.22em]"
						>
							{phrase}
							<span className="text-cherry" aria-hidden="true">
								{separator}
							</span>
						</span>
					))}
				</div>
				<div className="flex shrink-0 items-center gap-6 pr-6">
					{items.map((phrase, i) => (
						<span
							key={`b-${phrase}-${i.toString()}`}
							className="flex items-center gap-6 text-[13px] sm:text-sm font-semibold uppercase tracking-[0.22em]"
						>
							{phrase}
							<span className="text-cherry" aria-hidden="true">
								{separator}
							</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
