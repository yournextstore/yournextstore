import Image from "next/image";

const features = [
	{
		image: "/scraped-4.jpg",
		eyebrow: "Materials",
		title: "Sourced with intention",
		body: "FSC-certified solid woods, vegetable-tanned leather, and natural boucle. No particle board, ever.",
	},
	{
		image: "/scraped-5.jpg",
		eyebrow: "Atelier",
		title: "Made by 120+ studios",
		body: "Each piece is hand-finished in a small studio in Portugal, Denmark, or Vermont — never on a factory line.",
	},
	{
		image: "/scraped-0.jpg",
		eyebrow: "Warranty",
		title: "Twelve-year craft promise",
		body: "Joinery and upholstery guaranteed for a decade plus two. Repairs and re-covers, on the house.",
	},
];

export function FeaturesThreeUp() {
	return (
		<section className="bg-cream-wash">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
					<div className="max-w-xl">
						<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">— Why YNS</div>
						<h2 className="font-display text-4xl sm:text-5xl tracking-[-0.015em] text-[#1f2933]">
							Best Choose Our Furniture
						</h2>
					</div>
					<p className="max-w-sm text-sm text-[#1f2933]/60 leading-relaxed">
						Three quiet promises behind every piece we carry — material, maker, and a warranty long enough to
						outlast trends.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{features.map((f) => (
						<article key={f.title} className="group">
							<div className="relative aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-[#1f2933]/5">
								<Image
									src={f.image}
									alt={f.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute top-4 left-4 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#1f2933]/75">
									{f.eyebrow}
								</div>
							</div>
							<h3 className="mt-5 font-display text-2xl text-[#1f2933] tracking-[-0.01em]">{f.title}</h3>
							<p className="mt-2 text-[#1f2933]/65 leading-relaxed">{f.body}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
