import Image from "next/image";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-cream-grad">
			{/* Decorative folk dots */}
			<svg
				aria-hidden
				className="absolute inset-x-0 top-0 -z-0 w-full h-32 opacity-30"
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
			>
				<g fill="#c99a5e">
					<circle cx="80" cy="20" r="3" />
					<circle cx="240" cy="60" r="2" />
					<circle cx="420" cy="30" r="2.5" />
					<circle cx="640" cy="80" r="2" />
					<circle cx="860" cy="35" r="3" />
					<circle cx="1060" cy="65" r="2.5" />
				</g>
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20 text-center">
					<p className="font-display text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8b5e3c]">
						Wholesome · Small-batch · Made with love
					</p>

					<h1 className="mt-6 font-display font-extrabold text-[#4a2c1a] leading-[0.95]">
						<span className="block text-3xl sm:text-5xl lg:text-6xl">Extra Creamy, Defiantly Dreamy</span>
						<span className="mt-3 block text-5xl sm:text-7xl lg:text-[7rem]">Wholesome Goods</span>
					</h1>

					<p className="mx-auto mt-6 sm:mt-8 max-w-3xl font-display text-base sm:text-xl lg:text-2xl font-bold tracking-wide text-[#4a2c1a] uppercase">
						Real Ingredients! Family Owned! Sustaining Small Farms!
					</p>

					<div className="mt-10 flex flex-col items-center gap-5">
						<span className="inline-flex items-center gap-2 rounded-full bg-[#fbf4e8] border-2 border-[#8b5e3c] px-5 py-2 font-display text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#4a2c1a] shadow-[0_4px_0_0_#8b5e3c]">
							<span className="h-2 w-2 rounded-full bg-[#c99a5e]" /> Now shipping to 50 states
						</span>
					</div>

					{/* Layered product showcase row */}
					<div className="relative mt-8 sm:mt-12 lg:mt-16 mx-auto max-w-5xl">
						<div className="absolute inset-x-0 -bottom-6 mx-auto h-12 w-3/4 rounded-[100%] bg-[#8b5e3c]/20 blur-2xl" />
						<div className="relative aspect-[16/7] w-full">
							<Image
								src="/scraped-0.jpg"
								alt="Wholesome goods spread"
								fill
								priority
								sizes="(max-width: 768px) 100vw, 80vw"
								className="object-contain"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="pointer-events-none absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-[#f5e6d3]" />
		</section>
	);
}
