import Image from "next/image";

const tiles = [
	{ src: "/scraped-2.jpg", label: "Camp", caption: "Yucatán, MX" },
	{ src: "/scraped-3.jpg", label: "Trail", caption: "Cordillera Blanca" },
	{ src: "/scraped-4.jpg", label: "Splash", caption: "Cenote · Tulum" },
	{ src: "/scraped-5.jpg", label: "Sun", caption: "Coast of Oaxaca" },
];

export function LifestyleGallery() {
	return (
		<section className="bg-[var(--tropic-cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-red)] font-semibold">
							<span className="h-px w-8 bg-[var(--tropic-red)]" />
							In the wild
						</span>
						<h2 className="font-display italic mt-3 text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#15323b]">
							From hammock to high&nbsp;tide
						</h2>
					</div>
					<p className="max-w-md text-[#486870]">
						Real days documented by adventurers. Tag <span className="font-semibold">#YourNextAdventure</span>{" "}
						and we’ll re-share the wildest ones.
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
					{tiles.map((t, i) => (
						<figure
							key={t.src}
							className={`group relative overflow-hidden rounded-[28px] aspect-[3/4] bg-[var(--tropic-green)] ${i % 2 === 0 ? "lg:translate-y-6" : ""}`}
						>
							<Image
								src={t.src}
								alt={t.caption}
								fill
								sizes="(max-width: 640px) 50vw, 25vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
							<figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
								<span className="font-display italic text-2xl">{t.label}</span>
								<span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] border border-white/25">
									{t.caption}
								</span>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
