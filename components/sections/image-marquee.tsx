import Image from "next/image";
import { YnsLink } from "../yns-link";

const marqueeImages = [
	"/scraped-3.png",
	"/scraped-4.png",
	"/scraped-5.png",
	"/scraped-6.png",
	"/scraped-7.png",
	"/scraped-8.png",
];

export function ImageMarquee() {
	return (
		<section className="w-full overflow-hidden py-2 bg-background">
			<div className="animate-marquee flex gap-2 w-max">
				{/* Double the images for seamless loop */}
				{[...marqueeImages, ...marqueeImages].map((img, i) => (
					<YnsLink
						prefetch={"eager"}
						key={`marquee-${i}`}
						href="/products"
						className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 overflow-hidden group"
					>
						<Image
							src={img}
							alt="Gallery"
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-110"
							sizes="224px"
						/>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
