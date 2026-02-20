import Image from "next/image";

const galleryImages = [
	"/scraped-3.png",
	"/scraped-4.png",
	"/scraped-5.png",
	"/scraped-6.png",
	"/scraped-7.png",
	"/scraped-8.png",
	"/scraped-9.png",
	"/scraped-10.png",
];

export function ImageGalleryGrid() {
	return (
		<section className="py-4">
			<div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
				{galleryImages.map((src) => (
					<div key={src} className="relative aspect-square overflow-hidden">
						<Image
							src={src}
							alt="Gallery"
							fill
							className="object-cover hover:scale-110 transition-transform duration-500"
							sizes="(max-width: 640px) 25vw, 12.5vw"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
