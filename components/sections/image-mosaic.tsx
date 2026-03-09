import Image from "next/image";

const images = [
	"/scraped-5.png",
	"/scraped-6.png",
	"/scraped-7.png",
	"/scraped-8.png",
	"/scraped-9.png",
	"/scraped-10.png",
	"/scraped-11.png",
	"/scraped-12.png",
	"/scraped-13.png",
	"/scraped-14.png",
];

export function ImageMosaic() {
	return (
		<section className="py-16 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-heading text-2xl sm:text-3xl font-light tracking-wider text-center mb-12 uppercase">
					It&apos;s all in the details
				</h2>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
				{images.map((src) => (
					<div key={src} className="relative aspect-square overflow-hidden group">
						<Image
							src={src}
							alt="Product detail"
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-110"
							sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
