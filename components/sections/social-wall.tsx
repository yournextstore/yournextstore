import Image from "next/image";

const tiles = [
	{ src: "/scraped-1.jpg", handle: "@coconut.poolside", caption: "Sunset in a glass 🌅" },
	{ src: "/scraped-2.jpg", handle: "@miamimoodboard", caption: "Saturday looks like this" },
	{ src: "/scraped-3.jpg", handle: "@ms.guava", caption: "21+ summer goals 🍉" },
	{ src: "/scraped-4.jpg", handle: "@deck.party.co", caption: "Pop · Plunge · Repeat" },
	{ src: "/scraped-5.jpg", handle: "@studio.frutera", caption: "Mango Bandida >>> all" },
	{ src: "/scraped-0.jpg", handle: "@beach.club", caption: "Brought the heat" },
];

export function SocialWall() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
					<div>
						<p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-primary">
							@yournextstore
						</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl uppercase text-pop-ink">From the squad</h2>
					</div>
					<a
						href="https://instagram.com"
						className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-pop-ink hover:text-primary"
					>
						Follow us on Instagram →
					</a>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
					{tiles.map((tile, i) => (
						<a
							key={`${tile.handle}-${i}`}
							href="https://instagram.com"
							className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
						>
							<Image
								src={tile.src}
								alt={tile.caption}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-pop-ink/85 via-pop-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
								<p className="text-[10px] uppercase tracking-[0.2em] text-pop-yellow font-semibold">
									{tile.handle}
								</p>
								<p className="mt-1 text-xs text-white leading-snug">{tile.caption}</p>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
