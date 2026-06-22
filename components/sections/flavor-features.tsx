import { YnsLink } from "../yns-link";

const flavors = [
	{
		name: "Cocoa Almond",
		tag: "12g Protein",
		copy: "Stone-ground cacao, roasted almonds, a whisper of sea salt.",
		accent: "from-[#2a1810] to-[#1c0f08]",
	},
	{
		name: "Honey Oat",
		tag: "Honey Sweetened",
		copy: "Slow-baked oats and clover honey for the long morning miles.",
		accent: "from-[#5b3a20] to-[#2a1810]",
	},
	{
		name: "Caramel Cashew",
		tag: "Gluten Free",
		copy: "Buttery cashews folded into deep amber date caramel.",
		accent: "from-[#9c7a3e] to-[#5b3a20]",
	},
];

export function FlavorFeatures() {
	return (
		<section className="bg-cocoa-gradient border-y border-cream/5">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 md:grid-cols-3">
					{flavors.map((flavor, i) => (
						<div
							key={flavor.name}
							className={`relative p-8 sm:p-10 lg:p-14 ${i !== 0 ? "md:border-l border-cream/10" : ""} ${i !== flavors.length - 1 ? "border-b md:border-b-0 border-cream/10" : ""}`}
						>
							<div
								className={`absolute inset-0 bg-linear-to-br ${flavor.accent} opacity-40 pointer-events-none`}
							/>
							<div className="relative">
								<p className="font-display tracking-[0.24em] text-[10px] text-bronze-light mb-4">
									0{i + 1} / {flavor.tag.toUpperCase()}
								</p>
								<h3 className="font-display text-4xl sm:text-5xl text-cream leading-[0.9] mb-4">
									{flavor.name.split(" ").map((word) => (
										<span key={word} className="block">
											{word}
										</span>
									))}
								</h3>
								<p className="text-cream/70 text-sm leading-relaxed mb-8 max-w-xs">{flavor.copy}</p>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center font-display tracking-[0.18em] text-xs text-bronze-light hover:text-cream transition-colors group"
								>
									<span className="border-b border-bronze/40 group-hover:border-cream pb-1">SHOP NOW</span>
									<span className="ml-2">→</span>
								</YnsLink>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
