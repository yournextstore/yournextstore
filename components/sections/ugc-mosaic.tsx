import Image from "next/image";

const tiles = [
	{ src: "/scraped-0.jpg", caption: "@morningmint", tint: "bg-[var(--color-sky)]/30" },
	{ src: "/scraped-1.jpg", caption: "@bathroomstudio", tint: "bg-[var(--color-coral)]/30" },
	{ src: "/scraped-4.jpg", caption: "@dailyrituals", tint: "bg-[var(--color-mint)]/30" },
	{ src: "/scraped-5.jpg", caption: "@hotelvibes", tint: "bg-[var(--color-sunshine)]/30" },
] as const;

export function UgcMosaic() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
					<div>
						<p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-3">
							@yournextstore
						</p>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
							A tiny bathroom upgrade,
							<br />a thousand times over.
						</h2>
					</div>
					<a
						href="https://instagram.com"
						className="self-start sm:self-end text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors"
					>
						Follow along →
					</a>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{tiles.map((t) => (
						<figure
							key={t.src}
							className={`group relative aspect-[3/4] overflow-hidden rounded-2xl ${t.tint}`}
						>
							<Image
								src={t.src}
								alt={t.caption}
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<figcaption className="absolute inset-x-3 bottom-3 inline-flex w-fit rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
								{t.caption}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
