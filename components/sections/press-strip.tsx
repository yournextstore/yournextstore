const outlets = [
	"Vogue",
	"Bon Appétit",
	"Architectural Digest",
	"Goop",
	"The Cut",
	"Apartment Therapy",
	"Domino",
];

export function PressStrip() {
	return (
		<section className="bg-[#F5EFE6] border-y border-[#E0D5C1]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
				<p className="text-center uppercase tracking-[0.3em] text-[10px] sm:text-xs text-[#6B92AC] font-semibold mb-6">
					As Featured In
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-14">
					{outlets.map((o) => (
						<span
							key={o}
							className="headline-display text-base sm:text-lg lg:text-xl text-[#1F2A33]/55 hover:text-[#1F2A33] transition-colors tracking-wider"
						>
							{o}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
