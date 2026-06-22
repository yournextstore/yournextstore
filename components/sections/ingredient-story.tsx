import Image from "next/image";

export function IngredientStory() {
	return (
		<section className="relative bg-ink">
			<div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-12">
				<div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
					<Image
						src="/scraped-2.jpg"
						alt="Raw fragrance ingredients on slate"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
					<div className="absolute bottom-5 left-5 text-[10px] tracking-microcaps text-bone/70">
						Plate 03 — The Materia
					</div>
				</div>

				<div className="flex flex-col justify-center">
					<p className="text-[10px] tracking-microcaps text-foreground/55">The Ingredients</p>
					<h2 className="mt-3 font-serif-display text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
						We do not blend.
						<br />
						<span className="italic text-peach">We confess.</span>
					</h2>
					<div className="mt-8 space-y-5 text-[15px] leading-relaxed text-foreground/75 sm:text-base">
						<p>
							Each Your Next Store composition begins on a slab of wet slate — vanilla pod split lengthwise,
							iris root crushed under brass, a single bruised fig oozing nectar into the dark. We do not hide
							what hurt to make a thing beautiful.
						</p>
						<p>
							Our perfumer works from a small atelier in Grasse, distilling in batches of ninety. There is no
							machinery softening the edges. Cedar smoulders. Saffron stains. The bottles arrive on your shelf
							still smelling of the room they were poured in.
						</p>
					</div>

					<dl className="mt-12 grid grid-cols-3 gap-6 border-t border-foreground/10 pt-8">
						<div>
							<dt className="text-[10px] tracking-microcaps text-foreground/55">Origin</dt>
							<dd className="mt-2 font-serif-display text-2xl text-foreground">Grasse, FR</dd>
						</div>
						<div>
							<dt className="text-[10px] tracking-microcaps text-foreground/55">Batch</dt>
							<dd className="mt-2 font-serif-display text-2xl text-foreground">No. 19</dd>
						</div>
						<div>
							<dt className="text-[10px] tracking-microcaps text-foreground/55">Yield</dt>
							<dd className="mt-2 font-serif-display text-2xl text-foreground">90 / 1000</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>
	);
}
