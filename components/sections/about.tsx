import Image from "next/image";

export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-5">
						<p className="text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-blue-400)]">
							Our craft
						</p>
						<h2 className="mt-5 font-serif font-light text-4xl sm:text-5xl text-[color:var(--color-yns-navy)] leading-[1.05]">
							Whole leaves.
							<br />
							Full flavour.
						</h2>
						<p className="mt-6 text-base text-[color:var(--color-yns-navy)]/70 leading-relaxed">
							Our blends are built around single-origin leaves and small-batch botanicals — never dust, never
							bags. We work directly with the growers, taste every harvest, and bottle the rituals that matter
							most.
						</p>
					</div>
					<div className="lg:col-span-7 grid grid-cols-2 gap-3">
						<div className="relative aspect-[3/4] overflow-hidden">
							<Image
								src="/scraped-2.jpg"
								alt="Pouring tea"
								fill
								sizes="(max-width: 1024px) 50vw, 30vw"
								className="object-cover"
							/>
						</div>
						<div className="relative aspect-[3/4] overflow-hidden mt-10">
							<Image
								src="/scraped-3.jpg"
								alt="Beverage cans"
								fill
								sizes="(max-width: 1024px) 50vw, 30vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
