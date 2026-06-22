import Image from "next/image";

const tiles = [
	{ src: "/scraped-1.jpg", caption: "The Polish", sub: "Enzyme Whitening Treatment" },
	{ src: "/scraped-2.jpg", caption: "The Cleanse", sub: "Mineral Daily Toothpaste" },
	{ src: "/scraped-3.jpg", caption: "The Duo", sub: "Polish + Cleanse, ribbon-wrapped" },
];

export function ShowcaseStrip() {
	return (
		<section className="bg-cream">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
					{tiles.map((t, i) => (
						<figure
							key={t.caption}
							className="group relative"
							style={{ marginTop: i === 1 ? "2rem" : i === 2 ? "4rem" : "0" }}
						>
							<div className="relative aspect-[3/4] overflow-hidden bg-sand">
								<Image
									src={t.src}
									alt={t.caption}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-cocoa/15 via-transparent to-transparent" />
							</div>
							<figcaption className="mt-5 flex items-baseline justify-between">
								<div>
									<h3 className="font-serif text-xl text-foreground">{t.caption}</h3>
									<p className="text-[11px] tracking-arame uppercase text-foreground/55 mt-1">{t.sub}</p>
								</div>
								<span className="text-[11px] tracking-arame uppercase text-foreground/60">0{i + 1}</span>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
