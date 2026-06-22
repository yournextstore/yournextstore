import Image from "next/image";

const provenance = [
	{
		image: "/scraped-3.jpg",
		eyebrow: "The Bean",
		title: "Fair-trade espresso, slow-roasted in small lots.",
		body: "We work with three single-origin farms in Chiapas and Oaxaca. Beans are pulled just past first crack — never burnt, never bitter, always layered.",
	},
	{
		image: "/scraped-4.jpg",
		eyebrow: "The Citrus",
		title: "Sun-ripe peel, hand-zested for brightness.",
		body: "Blood oranges, tangerines and grapefruits arrive from family groves on the Mediterranean coast. The peel goes straight into our cold-press, hours from harvest.",
	},
];

export function Provenance() {
	return (
		<section className="bg-secondary/40 py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
				<div className="text-center mb-16 max-w-xl mx-auto">
					<p className="font-script text-2xl text-terracotta mb-3">Sourced with intention</p>
					<h2 className="font-display text-3xl sm:text-4xl text-espresso">
						From small farms to fizzy finish.
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
					{provenance.map((p) => (
						<article key={p.title} className="group">
							<div className="relative aspect-[5/4] rounded-sm overflow-hidden shadow-xl mb-6">
								<Image
									src={p.image}
									alt={p.title}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
							</div>
							<p className="text-[11px] uppercase tracking-[0.28em] text-terracotta mb-3 font-medium">
								{p.eyebrow}
							</p>
							<h3 className="font-display text-2xl sm:text-3xl text-espresso mb-4 leading-snug">{p.title}</h3>
							<p className="text-espresso/70 leading-relaxed max-w-lg">{p.body}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
