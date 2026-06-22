import Image from "next/image";

function InstagramGlyph({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
		</svg>
	);
}

const tiles = [
	{ src: "/scraped-0.jpg", caption: "Slept in, hair survived." },
	{ src: "/scraped-2.jpg", caption: "Cocoa bonnet, golden hour." },
	{ src: "/scraped-3.jpg", caption: "Sunday silk reset." },
	{ src: "/scraped-4.jpg", caption: "Honest curls, honest mornings." },
	{ src: "/scraped-5.jpg", caption: "Pillowcase upgrade complete." },
];

export function UgcStrip() {
	return (
		<section className="bg-bone">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16">
				<div className="flex flex-col items-center text-center mb-10">
					<p className="text-[11px] tracking-[0.3em] uppercase text-terracotta font-medium mb-3">
						As worn by you
					</p>
					<h2 className="font-serif text-3xl sm:text-4xl text-espresso">
						The <span className="italic">Your Next Store</span> community
					</h2>
					<a
						href="#"
						className="mt-4 inline-flex items-center gap-2 text-sm text-walnut/70 hover:text-terracotta transition-colors"
					>
						<InstagramGlyph className="w-4 h-4" />
						<span className="tracking-wider">@yournextstore</span>
					</a>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
					{tiles.map((tile, i) => (
						<a
							key={tile.src}
							href="#"
							className="group relative aspect-square overflow-hidden bg-cream"
							style={{ transform: i % 2 === 0 ? "translateY(0)" : "translateY(8px)" }}
						>
							<Image
								src={tile.src}
								alt={tile.caption}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<div className="absolute bottom-3 left-3 right-3 text-cream text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
								{tile.caption}
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
