import Image from "next/image";

function IGIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<rect x="3" y="3" width="18" height="18" rx="4" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
		</svg>
	);
}

const tiles = [
	{ src: "/scraped-0.jpg", alt: "Brewing process", handle: "@yournextstore" },
	{ src: "/scraped-1.jpg", alt: "Coffee can on concrete", handle: "@yournextstore" },
	{ src: "/scraped-2.jpg", alt: "Barista at work", handle: "@coldbrew_daily" },
	{ src: "/scraped-3.jpg", alt: "Beans flat lay", handle: "@yournextstore" },
	{ src: "/scraped-4.jpg", alt: "Street cafe corner", handle: "@morning_grind" },
	{ src: "/scraped-5.jpg", alt: "Espresso splash", handle: "@yournextstore" },
];

export function InstagramGrid() {
	return (
		<section id="locator" className="relative bg-[#f2f2f2] py-24 sm:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12 flex flex-col items-center text-center">
					<IGIcon className="mb-4 h-6 w-6 text-[#0e0e0e]" />
					<span className="jolt-eyebrow text-[#6e6e6e]">— Tag #yournextstore</span>
					<h2 className="jolt-headline mt-3 text-4xl sm:text-5xl lg:text-6xl text-[#0e0e0e]">In the wild</h2>
					<p className="mt-4 max-w-md text-sm text-[#6e6e6e]">
						Real cans. Real curbs. Real people pouring real coffee, photographed honestly.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
					{tiles.map((tile, i) => (
						<a
							key={tile.src}
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className={`group relative aspect-square overflow-hidden bg-[#0e0e0e] ring-1 ring-[#0e0e0e]/10 ${
								i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1" : ""
							}`}
						>
							<Image
								src={tile.src}
								alt={tile.alt}
								fill
								sizes="(max-width: 768px) 50vw, 16vw"
								className="object-cover jolt-mono transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity group-hover:opacity-100">
								<IGIcon className="h-3 w-3" />
								{tile.handle}
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
