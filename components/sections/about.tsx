import Image from "next/image";
import { Leaf } from "./leaves";

const blocks = [
	{
		image: "/scraped-0.jpg",
		eyebrow: "Sourced with care",
		title: "Jackfruit from sun-soaked orchards",
		copy: "Every batch begins with whole jackfruit, hand-harvested from cooperative farms and slow-cooked to lock in that meaty, satisfying chew.",
	},
	{
		image: "/scraped-2.jpg",
		eyebrow: "Recipes worth sharing",
		title: "Bold flavors, real ingredients",
		copy: "We season with kitchen-staple spices — smoked paprika, fresh ginger, garlic — never lab-made anything. The kind of pantry you'd want at your own table.",
		reverse: true,
	},
	{
		image: "/scraped-4.jpg",
		eyebrow: "Made for everyone",
		title: "A snack that brings people together",
		copy: "Vegan, gluten-free, allergy-friendly. Designed so the most inclusive option at the picnic is also the most delicious one in the bowl.",
	},
];

export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-[var(--cream-deep)]/60">
			<div className="absolute top-10 left-6 opacity-40">
				<Leaf className="w-12 h-20 -rotate-12" color="#0f3d2e" />
			</div>
			<div className="absolute bottom-10 right-6 opacity-40">
				<Leaf className="w-12 h-20 rotate-12" color="#0f3d2e" />
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-16">
					<p className="font-display uppercase tracking-[0.32em] text-leaf text-sm">Our Story</p>
					<h2 className="font-display uppercase text-forest text-4xl sm:text-5xl mt-3">
						Real food, grown the right way
					</h2>
				</div>

				<div className="space-y-16 sm:space-y-24">
					{blocks.map((block) => (
						<div
							key={block.title}
							className={`grid items-center gap-8 sm:gap-16 grid-cols-1 lg:grid-cols-2 ${block.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
						>
							<div className="relative">
								<div className="absolute -inset-4 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] bg-leaf/15" />
								<div className="relative aspect-[5/4] overflow-hidden rounded-[36px] border-4 border-cream shadow-[0_25px_60px_-30px_rgba(15,61,46,0.5)]">
									<Image
										src={block.image}
										alt={block.title}
										fill
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-cover"
									/>
								</div>
								<div className="absolute -bottom-6 -right-4 hidden sm:block">
									<Leaf className="w-16 h-24 rotate-12" color="#2e7d3a" />
								</div>
							</div>
							<div className="max-w-md">
								<p className="font-display uppercase tracking-[0.3em] text-leaf text-xs">{block.eyebrow}</p>
								<h3 className="font-display uppercase text-forest text-3xl sm:text-4xl mt-2 leading-tight">
									{block.title}
								</h3>
								<p className="mt-5 text-forest/75 leading-relaxed">{block.copy}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
