import Image from "next/image";

const InstagramIcon = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
		<rect x="3" y="3" width="18" height="18" rx="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
	</svg>
);

const tiles = [
	{ src: "/scraped-3.jpg", alt: "Customer photo with product" },
	{ src: "/scraped-4.jpg", alt: "Behind the scenes" },
	{ src: "/scraped-5.jpg", alt: "Lifestyle moment" },
	{ src: "/scraped-1.jpg", alt: "Hair transformation" },
	{ src: "/scraped-2.jpg", alt: "Wash day routine" },
	{ src: "/scraped-0.jpg", alt: "Confidence shot" },
];

export function UgcWall() {
	return (
		<section className="bg-[color:var(--yns-cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="text-center max-w-2xl mx-auto mb-12">
					<span className="font-script text-3xl text-[color:var(--yns-red)]">tagged you</span>
					<h2 className="mt-1 font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[color:var(--yns-ink)]">
						#YourNextHair
					</h2>
					<p className="mt-4 text-[color:var(--yns-ink)]/70">
						Share your wash-day glow-ups and get featured.
					</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
					{tiles.map((tile) => (
						<a
							key={tile.src + tile.alt}
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative aspect-square overflow-hidden bg-white"
						>
							<Image
								src={tile.src}
								alt={tile.alt}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-[color:var(--yns-pink)]/0 group-hover:bg-[color:var(--yns-pink)]/30 transition-colors flex items-center justify-center">
								<InstagramIcon className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
