import Image from "next/image";

const brandValues = [
	{ title: "Minimal Aesthetic", image: "/scraped-8.png" },
	{ title: "Hydrate Better", image: "/scraped-9.png" },
	{ title: "Smart Simplicity", image: "/scraped-10.png" },
	{ title: "Sustainable Living", image: "/scraped-11.png" },
];

export function BrandMarquee() {
	return (
		<section className="py-10 border-y border-border/50 overflow-hidden bg-background">
			<div className="flex animate-marquee" style={{ width: "max-content" }}>
				{[...brandValues, ...brandValues, ...brandValues, ...brandValues].map((item, i) => (
					<div key={`brand-${i}`} className="flex items-center gap-4 mx-8">
						<div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary flex-shrink-0">
							<Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
						</div>
						<h3 className="text-lg font-light text-foreground whitespace-nowrap">{item.title}</h3>
					</div>
				))}
			</div>
		</section>
	);
}
