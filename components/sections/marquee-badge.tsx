export function MarqueeBadge() {
	const items = [
		"Hand-baked daily",
		"Butter, never margarine",
		"Free shipping on $49+",
		"Hand-written gift notes",
		"Small-batch since 2018",
		"Family-run kitchen",
	];
	const repeated = [...items, ...items];

	return (
		<section className="bg-[var(--maroon)] text-[var(--cream)] py-5 overflow-hidden border-y border-[var(--ink)]">
			<div className="flex whitespace-nowrap animate-marquee">
				{repeated.map((text, i) => (
					<div
						key={`${text}-${i}`}
						className="flex items-center gap-8 px-8 text-sm tracking-[0.3em] uppercase font-medium"
					>
						<span>{text}</span>
						<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[var(--blush)]">
							<title>heart</title>
							<path d="M12 21s-7.5-4.5-9.5-9.2C1.2 8.6 3 5 6.4 5c2 0 3.5 1 4.6 2.5C12.1 6 13.6 5 15.6 5 19 5 20.8 8.6 19.5 11.8 17.5 16.5 12 21 12 21z" />
						</svg>
					</div>
				))}
			</div>
		</section>
	);
}
