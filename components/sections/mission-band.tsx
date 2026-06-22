export function MissionBand() {
	return (
		<section id="about" className="yns-ripple-bg text-[#F5EFE6] relative overflow-hidden">
			<div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center relative">
				<p className="script-tag text-3xl sm:text-5xl lg:text-6xl leading-tight text-[#F5EFE6]">
					Life is messy, but that&apos;s where the magic happens.
				</p>
				<p className="mt-8 text-base sm:text-lg max-w-2xl mx-auto text-[#F5EFE6]/85 leading-relaxed">
					Celebrate the fun, chaotic moments with products that make laundry day feel effortless — plant-based
					formulas, refillable bottles, and dye-free clean for the people and planet you love.
				</p>
			</div>
			{/* Soft bottom wave fading out into cream */}
			<svg
				className="absolute -bottom-px left-0 w-full h-12 sm:h-20"
				viewBox="0 0 1440 120"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z" fill="#F5EFE6" />
			</svg>
		</section>
	);
}
