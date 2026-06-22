import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative border-t border-border/60 bg-bone-gradient">
			<div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-32">
				<div className="grid grid-cols-12 gap-6 lg:gap-10">
					<div className="col-span-12 lg:col-span-5">
						<p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
							(03) — Our Manifesto
						</p>
						<h2 className="mt-6 font-serif text-5xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-foreground">
							A quieter
							<br />
							<span className="italic text-clay">kind of</span>
							<br />
							modern.
						</h2>
					</div>
					<div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-20">
						<p className="font-serif text-2xl leading-snug text-foreground max-w-prose">
							We believe in objects with posture. Things that age into the room around them, hold the light
							well, and earn their place over decades — not seasons.
						</p>
						<p className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-prose">
							Each piece in the Your Next Store catalogue is commissioned from independent makers we trust —
							woodworkers, weavers, ceramicists — and finished in small batches by hand. The result is a
							catalogue of considered staples: chairs, lamps, vessels and textiles that quietly furnish a
							life.
						</p>
						<div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
							<Stat label="Years" value="70" />
							<Stat label="Makers" value="38" />
							<Stat label="Finishes" value="240" />
						</div>
					</div>
				</div>

				<div className="mt-20 grid grid-cols-12 gap-6">
					<Plate src="/scraped-0.jpg" caption="The Studio · Copenhagen" />
					<Plate src="/scraped-3.jpg" caption="Wood Atelier · Jutland" />
					<Plate src="/scraped-5.jpg" caption="Showroom · Tokyo Annex" />
				</div>
			</div>
		</section>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="font-serif text-4xl tracking-tight text-foreground">{value}</p>
			<p className="mt-1 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">{label}</p>
		</div>
	);
}

function Plate({ src, caption }: { src: string; caption: string }) {
	return (
		<figure className="col-span-12 sm:col-span-6 lg:col-span-4">
			<div className="relative aspect-[4/5] overflow-hidden rounded-sm ring-1 ring-border/60 bg-bone-2">
				<Image
					src={src}
					alt={caption}
					fill
					sizes="(max-width: 768px) 100vw, 33vw"
					className="object-cover transition-transform duration-700 hover:scale-[1.03]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent"
				/>
			</div>
			<figcaption className="mt-3 flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
				<span>{caption}</span>
				<span aria-hidden="true">→</span>
			</figcaption>
		</figure>
	);
}
