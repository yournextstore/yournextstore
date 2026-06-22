import Image from "next/image";

const pillars = [
	{
		title: "Rooted in nature",
		body: "Each formula begins with whole-plant ingredients, foraged and small-batch milled.",
	},
	{
		title: "Backed by science",
		body: "Prebiotic nutrients, mineral co-factors and antioxidant pairings tested for daily ritual.",
	},
	{
		title: "Made with patience",
		body: "Slow blends, glass packaging, and a soft touch from earth-grown botanicals to your shelf.",
	},
];

export function About() {
	return (
		<section id="about" className="bg-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand ring-1 ring-cocoa/10">
						<Image
							src="/scraped-2.jpg"
							alt="Botanical apothecary still life"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-cocoa/15 via-transparent to-transparent" />
						<div className="absolute bottom-6 left-6 right-6 text-cream">
							<span className="font-serif text-2xl italic block">est. our quiet corner of the earth</span>
						</div>
					</div>
					<div>
						<span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Our Story</span>
						<h2 className="mt-3 font-serif text-4xl sm:text-5xl leading-[1.05] text-cocoa">
							A modern apothecary, gently considered.
						</h2>
						<p className="mt-5 text-base text-cocoa/75 leading-relaxed">
							We started Your Next Store with one belief — that the smallest daily rituals deserve the most
							thoughtfully made objects. Every product on our shelves is chosen for its botanical integrity,
							its quiet craftsmanship, and its ability to fold easily into the rhythm of a beautiful, ordinary
							day.
						</p>
						<ul className="mt-8 space-y-5">
							{pillars.map((p) => (
								<li key={p.title} className="flex gap-4">
									<span
										className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta"
										aria-hidden="true"
									/>
									<div>
										<h3 className="font-serif text-xl text-cocoa">{p.title}</h3>
										<p className="text-sm text-cocoa/70 mt-1 leading-relaxed">{p.body}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
