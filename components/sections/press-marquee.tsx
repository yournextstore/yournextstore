const outlets = [
	"Good Food Co.",
	"The Pantry Post",
	"Farm Forward",
	"Mod Kitchen",
	"Heritage Table",
	"Storyboard Mag",
];

export function PressMarquee() {
	const items = [...outlets, ...outlets];
	return (
		<section className="bg-[#f5e6d3] border-t border-[#d9c1a3]/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<p className="text-center font-display text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8b5e3c]">
					As featured in
				</p>
				<div className="mt-8 relative overflow-hidden">
					<div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f5e6d3] to-transparent z-10" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#f5e6d3] to-transparent z-10" />
					<div className="flex w-max animate-marquee gap-12 sm:gap-16">
						{items.map((outlet, i) => (
							<span
								key={`${outlet}-${i}`}
								className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#8b5e3c] whitespace-nowrap italic"
							>
								{outlet}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
