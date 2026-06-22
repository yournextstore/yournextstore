import Image from "next/image";

const galleryImages = [
	"/scraped-3.jpg",
	"/scraped-4.jpg",
	"/scraped-5.jpg",
	"/scraped-6.jpg",
	"/scraped-7.jpg",
	"/scraped-8.jpg",
	"/scraped-9.jpg",
	"/scraped-10.jpg",
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
