import Image from "next/image";

const images = [
	"/scraped-10.png",
	"/scraped-11.png",
	"/scraped-12.png",
	"/scraped-13.png",
	"/scraped-14.png",
];

export function InstagramGrid() {
	return (
		<section className="py-14 sm:py-20">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10">
					<h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">Shop by Gram</h2>
					<p className="mt-2 text-sm text-muted-foreground">Follow us on Instagram for daily inspiration</p>
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
				{images.map((image, index) => (
					<div key={`insta-${index}`} className="group relative aspect-square overflow-hidden cursor-pointer">
						<Image
							src={image}
							alt={`Style inspiration ${index + 1}`}
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
							className="object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							>
								<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
								<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
								<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
							</svg>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
