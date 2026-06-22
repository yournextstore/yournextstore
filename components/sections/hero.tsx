import Image from "next/image";

export function Hero() {
	return (
		<section className="relative tizz-hero-gradient overflow-hidden tizz-noise">
			{/* Decorative stars */}
			<div className="pointer-events-none absolute inset-0 opacity-70">
				<svg
					className="absolute top-10 left-[8%] w-12 h-12 text-[var(--tizz-yellow)] tizz-spin-slow"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
				</svg>
				<svg
					className="absolute top-24 right-[12%] w-8 h-8 text-[var(--tizz-orange)] tizz-spin-slow"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
				</svg>
				<svg
					className="absolute bottom-24 left-[14%] w-6 h-6 text-[var(--tizz-green)] tizz-spin-slow"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
				</svg>
				<svg
					className="absolute bottom-40 right-[8%] w-10 h-10 text-[var(--tizz-yellow)] tizz-spin-slow"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
				</svg>
			</div>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative min-h-[600px] lg:min-h-[720px] flex items-center justify-center py-12">
					{/* Hero image (the can pyramid) */}
					<div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-[4/5]">
						<Image
							src="/scraped-0.jpg"
							alt="Stacked pyramid of soda cans"
							fill
							priority
							sizes="(max-width: 768px) 100vw, 800px"
							className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
						/>
					</div>
				</div>
			</div>

			{/* Diagonal bottom edge effect */}
			<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[var(--tizz-deep)]/40 pointer-events-none" />
		</section>
	);
}
