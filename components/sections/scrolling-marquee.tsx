import Image from "next/image";

const marqueeItems = [
	{ text: "Express Your True Self", image: "/scraped-6.png" },
	{ text: "Exclusive Seasonal Picks", image: "/scraped-7.png" },
	{ text: "Exclusive Seasonal Picks", image: "/scraped-8.png" },
];

export function ScrollingMarquee() {
	const repeated = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

	return (
		<section className="py-6 overflow-hidden border-y border-border">
			<div className="animate-marquee flex items-center whitespace-nowrap">
				{repeated.map((item, index) => (
					<div key={`marquee-item-${index}`} className="flex items-center gap-6 mx-6">
						<span className="text-lg sm:text-xl font-heading italic text-foreground">{item.text}</span>
						<div className="w-12 h-12 rounded-full overflow-hidden bg-secondary shrink-0">
							<Image src={item.image} alt="" width={48} height={48} className="w-full h-full object-cover" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
