import Image from "next/image";

const features = [
	{
		image: "/scraped-12.png",
		title: "Plant Extracts",
		description:
			"Each of our formulations is developed with potent active ingredients that help your skin make progress.",
	},
	{
		image: "/scraped-13.png",
		title: "One of a Kind SPF",
		description:
			"A formulation so unique that leaves zero white casts, and takes care of your pores and acne.",
	},
	{
		image: "/scraped-14.png",
		title: "Highly Effective",
		description: "Wake up to revived, hydrated, smooth and glowing skin always.",
	},
	{
		image: "/scraped-5.png",
		title: "Advanced Science",
		description:
			"Enable a new healthy relationship between you and your skin with scientifically advanced skincare.",
	},
];

export function MultiFeature() {
	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 className="mb-12 text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
					Make Us a Part of Your Skincare Journey
				</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((f) => (
						<div key={f.title} className="group">
							<div className="relative mb-4 aspect-square overflow-hidden rounded-sm">
								<Image
									src={f.image}
									alt={f.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
							<h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
