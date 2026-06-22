import Image from "next/image";

const features = [
	{
		image: "/scraped-1.jpg",
		eyebrow: "Engineered for the trail",
		title: "Carbonate anywhere.",
		body: "A sealed pressure cap that hits four bars in seconds — no electricity, no proprietary bottle required.",
	},
	{
		image: "/scraped-2.jpg",
		eyebrow: "Refillable capsules",
		title: "Sixty pours per cartridge.",
		body: "Swap empties at any of our 3,400 trailhead drop points. Mail-back included with every order.",
	},
	{
		image: "/scraped-3.jpg",
		eyebrow: "Built to outlast",
		title: "Marine-grade everything.",
		body: "316 stainless body, food-safe silicone gaskets, and a lifetime cap guarantee against pressure failure.",
	},
];

export function About() {
	return (
		<section id="story" className="bg-black">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Centered black band intro */}
				<div className="py-16 sm:py-24 text-center">
					<p className="text-[11px] uppercase tracking-[0.32em] text-white/45 font-medium">
						Why Your Next Store?
					</p>
					<h2 className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02] text-white max-w-3xl mx-auto">
						Gear that earns its place in your pack.
					</h2>
				</div>

				{/* Edge-to-edge three-column row */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-16 sm:pb-24">
					{features.map((feature) => (
						<article
							key={feature.title}
							className="group relative overflow-hidden rounded-2xl bg-[var(--yns-charcoal)]"
						>
							<div className="relative aspect-[4/5] w-full overflow-hidden">
								<Image
									src={feature.image}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div
									aria-hidden="true"
									className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
								/>
							</div>
							<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
								<p className="text-[10px] uppercase tracking-[0.22em] text-[var(--yns-lime)] font-semibold">
									{feature.eyebrow}
								</p>
								<h3 className="mt-3 font-display text-2xl sm:text-3xl leading-[1.05] text-white">
									{feature.title}
								</h3>
								<p className="mt-3 max-w-sm text-sm text-white/70 leading-relaxed">{feature.body}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
