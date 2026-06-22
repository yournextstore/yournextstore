import Image from "next/image";

const TILES = [
	{ src: "/scraped-0.jpg", handle: "@ava.morgan" },
	{ src: "/scraped-1.jpg", handle: "@elise.k" },
	{ src: "/scraped-2.jpg", handle: "@sienna_rose" },
	{ src: "/scraped-3.jpg", handle: "@nora.fei" },
	{ src: "/scraped-4.jpg", handle: "@harper.ln" },
	{ src: "/scraped-5.jpg", handle: "@miye.rose" },
];

export function UgcCarousel() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<div className="mb-10 flex items-end justify-between">
					<div>
						<p className="text-[11px] font-medium uppercase tracking-[0.24em] text-clay">
							@yournextstore on Instagram
						</p>
						<h2
							className="mt-3 font-display text-[32px] italic leading-tight text-foreground sm:text-[40px]"
							style={{ fontFamily: "var(--font-cormorant)" }}
						>
							Styled by you
						</h2>
					</div>
					<a
						href="#"
						className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground sm:inline-flex"
					>
						Follow us →
					</a>
				</div>
				<div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:gap-4">
					{TILES.map((tile) => (
						<a
							href="#"
							key={tile.handle}
							className="group relative aspect-[3/4] w-[60%] flex-shrink-0 snap-start overflow-hidden rounded-sm bg-blush sm:w-[28%] lg:w-[16.66%]"
						>
							<Image
								src={tile.src}
								alt={tile.handle}
								fill
								sizes="(max-width: 640px) 60vw, (max-width: 1024px) 28vw, 17vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
							/>
							<span className="absolute bottom-3 left-3 text-[11px] font-medium tracking-[0.06em] text-white opacity-0 transition-opacity group-hover:opacity-100">
								{tile.handle}
							</span>
							<svg
								viewBox="0 0 24 24"
								className="absolute right-3 top-3 h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								aria-hidden="true"
							>
								<title>Shoppable</title>
								<rect x="3" y="3" width="18" height="18" rx="4" />
								<circle cx="12" cy="12" r="3.5" />
							</svg>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
