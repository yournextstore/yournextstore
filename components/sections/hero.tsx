import Image from "next/image";

export function Hero() {
	return (
		<section className="relative">
			{/* Full-width hero image */}
			<div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
				<Image
					src="/scraped-3.png"
					alt="Modern furniture in a beautifully designed living space"
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
			</div>
		</section>
	);
}
