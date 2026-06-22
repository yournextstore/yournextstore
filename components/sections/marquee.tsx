export function Marquee({
	text = "Delicious wholesome snacks from our family to yours",
	repeat = 8,
}: {
	text?: string;
	repeat?: number;
}) {
	const items = Array.from({ length: repeat });

	return (
		<section
			aria-label="Brand tagline marquee"
			className="yns-cream-noise relative overflow-hidden border-t border-b border-[#E5D3B7] py-4 sm:py-5"
		>
			<div className="flex whitespace-nowrap yns-marquee">
				{items.map((_, i) => (
					<span
						key={`m-${i}`}
						className="mx-6 inline-flex items-center gap-6 text-[12px] font-bold uppercase tracking-[0.32em] text-[#8C1F2A] sm:text-sm"
					>
						{text}
						<svg viewBox="0 0 20 20" className="h-3 w-3 text-[#D86A4B]" aria-hidden="true">
							<title>·</title>
							<circle cx="10" cy="10" r="3" fill="currentColor" />
						</svg>
					</span>
				))}
			</div>
		</section>
	);
}
