import Image from "next/image";

const features = [
	{
		title: "100% Extra Virgin Olive Oil",
		description: "Made from Picual olives, ensuring a pure and unblended product.",
	},
	{
		title: "High Yield",
		description: "It takes about 13 pounds of olives to produce one liter of oil.",
	},
	{
		title: "Single-Origin",
		description: "Sourced exclusively from Ja\u00e9n, Spain, known for premium olive production.",
	},
	{
		title: "Harvested at Peak Season",
		description: "Olives are picked during peak ripeness, providing a balanced, mellow flavor.",
	},
	{
		title: "Versatile Cooking",
		description: "Ideal for roasting, frying, and baking due to its high smoke point.",
	},
	{
		title: "Eco-Friendly Packaging",
		description: "Comes in a squeezable, easy-to-use bottle, minimizing waste.",
	},
];

export function SecretSauce() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
				<h2 className="font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground text-center mb-4">
					The secret sauce
				</h2>

				<div className="grid lg:grid-cols-3 gap-8 mt-12 items-center">
					{/* Left features */}
					<div className="space-y-8">
						{features.slice(0, 3).map((feature) => (
							<div key={feature.title} className="text-right lg:text-right">
								<h3 className="text-lg font-bold mb-1">{feature.title}</h3>
								<p className="text-sm text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>

					{/* Center image */}
					<div className="relative aspect-[3/4] max-w-xs mx-auto w-full rounded-md border-[3px] border-foreground shadow-[8px_8px_0_0_#000] overflow-hidden">
						<Image src="/scraped-10.jpg" alt="Premium ingredients" fill className="object-cover" />
					</div>

					{/* Right features */}
					<div className="space-y-8">
						{features.slice(3).map((feature) => (
							<div key={feature.title}>
								<h3 className="text-lg font-bold mb-1">{feature.title}</h3>
								<p className="text-sm text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
