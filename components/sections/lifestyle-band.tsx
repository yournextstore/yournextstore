import Image from "next/image";

const scenes = [
	{ src: "/scraped-0.jpg", label: "At the cafe", caption: "A quieter morning." },
	{ src: "/scraped-3.jpg", label: "In the studio", caption: "Make, don't scroll." },
	{ src: "/scraped-5.jpg", label: "By the bedside", caption: "Reclaim the last hour." },
];

export function LifestyleBand() {
	return (
		<section className="relative bg-spotlight py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between flex-wrap gap-4 mb-12">
					<div className="max-w-xl">
						<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">Live with it</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-bone text-balance">
							Designed for the rooms you actually live in.
						</h2>
					</div>
					<p className="max-w-sm text-muted-foreground">
						Stick it under the cafe counter, by your bed, or on the studio wall. Subtle by design, deliberate
						in effect.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
					{scenes.map(({ src, label, caption }) => (
						<figure
							key={src}
							className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-card ring-1 ring-bone/5"
						>
							<Image
								src={src}
								alt={caption}
								fill
								className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, 33vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
							<figcaption className="absolute inset-x-0 bottom-0 p-5">
								<p className="text-[11px] uppercase tracking-[0.18em] text-ember-soft font-medium">{label}</p>
								<p className="mt-1 font-display text-xl text-bone">{caption}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
