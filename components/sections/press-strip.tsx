const outlets = [
	"VOGUE",
	"THE NEW YORKER",
	"MONOCLE",
	"DAZED",
	"BON APPÉTIT",
	"HIGHSNOBIETY",
	"WALLPAPER*",
	"FOOD & WINE",
];

export function PressStrip() {
	return (
		<section className="relative overflow-hidden border-b border-[#0e0e0e]/10 bg-white py-12 sm:py-14">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<p className="mb-8 text-center text-[10px] uppercase tracking-[0.32em] text-[#6e6e6e]">
					As seen in — and shouted about by
				</p>
				<div className="relative overflow-hidden">
					{/* fade edges */}
					<div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
					<div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

					<div className="jolt-marquee">
						{[...outlets, ...outlets].map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="shrink-0 font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.06em] text-[#6e6e6e]/80"
								style={{ fontFamily: "var(--font-display)" }}
							>
								{name}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
