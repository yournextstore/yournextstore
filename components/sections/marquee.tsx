type MarqueeProps = {
	text?: string;
	repeat?: number;
};

export function Marquee({ text = "Holiday often", repeat = 12 }: MarqueeProps) {
	const items = Array.from({ length: repeat });
	return (
		<section
			aria-hidden="true"
			className="relative bg-[#1f46c2] border-y-[3px] border-[#15348f] overflow-hidden"
		>
			<div className="flex whitespace-nowrap py-5 sm:py-6 animate-marquee">
				{items.map((_, i) => (
					<span
						key={`m-a-${i}`}
						className="font-display text-[#f5e4d2] uppercase text-3xl sm:text-4xl lg:text-5xl tracking-[0.18em] mx-8 flex items-center gap-8"
					>
						{text}
						<span className="text-[#e8b547]">✦</span>
					</span>
				))}
				{items.map((_, i) => (
					<span
						key={`m-b-${i}`}
						className="font-display text-[#f5e4d2] uppercase text-3xl sm:text-4xl lg:text-5xl tracking-[0.18em] mx-8 flex items-center gap-8"
					>
						{text}
						<span className="text-[#e8b547]">✦</span>
					</span>
				))}
			</div>
		</section>
	);
}
