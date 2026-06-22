import Image from "next/image";

const moments = [
	{ image: "/scraped-0.jpg", quote: "She finds her quiet here.", author: "— Sara, Copenhagen" },
	{ image: "/scraped-1.jpg", quote: "A small ritual that holds us together.", author: "— Mateo, Lisbon" },
	{ image: "/scraped-2.jpg", quote: "He looks at me like the world makes sense.", author: "— Aiko, Tokyo" },
	{ image: "/scraped-3.jpg", quote: "Stillness, finally.", author: "— June, Brooklyn" },
	{ image: "/scraped-4.jpg", quote: "Skin to skin, that's the whole language.", author: "— Léa, Paris" },
	{ image: "/scraped-5.jpg", quote: "We learn each other by morning light.", author: "— Yusuf, Istanbul" },
];

export function Community() {
	const loop = [...moments, ...moments];

	return (
		<section className="bg-[var(--background)] overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28 pb-10">
				<div className="flex items-end justify-between gap-6 mb-12">
					<div>
						<p className="text-[10px] tracking-[0.32em] uppercase text-foreground/60 mb-3">— Community</p>
						<h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02]">
							Quiet moments,
							<br />
							shared softly.
						</h2>
					</div>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noreferrer"
						className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-foreground/70 hover:text-[var(--olive-dark)] transition-colors"
					>
						Follow @YourNextStore →
					</a>
				</div>
			</div>

			<div className="relative w-full">
				<div className="flex gap-5 lg:gap-7 w-max animate-marquee-slow">
					{loop.map((m, i) => (
						<figure
							key={`${m.author}-${i}`}
							className="relative w-[260px] sm:w-[300px] lg:w-[360px] shrink-0"
						>
							<div className="relative aspect-[3/4] overflow-hidden rounded-sm grayscale">
								<Image
									src={m.image}
									alt=""
									fill
									sizes="(max-width: 768px) 80vw, 360px"
									className="object-cover"
								/>
							</div>
							<figcaption className="mt-4 px-1">
								<p className="font-display text-lg leading-snug text-foreground">"{m.quote}"</p>
								<p className="mt-1 text-[10px] tracking-[0.28em] uppercase text-foreground/55">{m.author}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
