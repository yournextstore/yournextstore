import Image from "next/image";

const brands = [
	{ name: "Brand 1", image: "/scraped-8.png" },
	{ name: "Brand 2", image: "/scraped-9.png" },
	{ name: "Brand 3", image: "/scraped-10.jpg" },
	{ name: "Brand 4", image: "/scraped-12.png" },
	{ name: "Brand 5", image: "/scraped-14.png" },
];

export function BrandsStrip() {
	return (
		<section className="border-y border-border bg-white py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center gap-8 sm:gap-12 overflow-x-auto">
					{brands.map((brand) => (
						<div
							key={brand.name}
							className="flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
						>
							<Image
								src={brand.image}
								alt={brand.name}
								width={120}
								height={50}
								className="h-10 sm:h-12 w-auto object-contain"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
