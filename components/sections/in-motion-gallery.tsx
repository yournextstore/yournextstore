import Image from "next/image";

const tiles = [
	{ src: "/scraped-0.jpg", caption: "0:01 · Warm-up", alt: "Close-up portrait" },
	{ src: "/scraped-2.jpg", caption: "0:07 · Sprint", alt: "Athletic figure" },
	{ src: "/scraped-3.jpg", caption: "0:18 · Encore", alt: "Editorial scene" },
	{ src: "/scraped-4.jpg", caption: "0:32 · Cooldown", alt: "Lifestyle moment" },
];

export function InMotionGallery() {
	return (
		<section id="impact" className="bg-ink text-cream">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
				<div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<div>
						<p className="eyebrow text-cream/60">Wear Test</p>
						<h2 className="mt-4 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
							Twelve hours.
							<br />
							Zero compromise.
						</h2>
					</div>
					<p className="max-w-sm text-sm leading-relaxed text-cream/65">
						Filmed in one continuous shoot — no retouching, no reapplication. Just the same face, the same
						spray, twelve hours later.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
					{tiles.map((tile) => (
						<figure key={tile.src} className="group relative aspect-[3/4] overflow-hidden">
							<Image
								src={tile.src}
								alt={tile.alt}
								fill
								sizes="(max-width: 640px) 50vw, 25vw"
								className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
							<figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
								<p className="eyebrow text-cream/80">{tile.caption}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
