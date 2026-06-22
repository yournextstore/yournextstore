import Image from "next/image";

const TILES = [
	"/scraped-0.jpg",
	"/scraped-1.jpg",
	"/scraped-2.jpg",
	"/scraped-3.jpg",
	"/scraped-4.jpg",
	"/scraped-5.jpg",
];

export function InstagramWall() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-24">
				<div className="text-center">
					<p className="text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-blue-400)]">
						The kitchen
					</p>
					<h2 className="mt-4 font-serif font-light text-3xl sm:text-4xl text-[color:var(--color-yns-navy)]">
						Tag <span className="italic">@yournextstore</span> to feature
					</h2>
				</div>
				<div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
					{TILES.map((src, i) => (
						<a
							key={src}
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative aspect-square overflow-hidden bg-[color:var(--color-yns-blue-100)]"
						>
							<Image
								src={src}
								alt="Lifestyle"
								fill
								sizes="(max-width: 768px) 50vw, 16vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-[color:var(--color-yns-navy)]/0 group-hover:bg-[color:var(--color-yns-navy)]/20 transition-colors flex items-center justify-center">
								<svg
									className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<title>instagram</title>
									<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
									<circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
									<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
								</svg>
							</div>
							<span className="sr-only">Image {i + 1}</span>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
