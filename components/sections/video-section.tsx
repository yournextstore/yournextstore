import Image from "next/image";

export function VideoSection() {
	return (
		<section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
			{/* Background image (instead of video) */}
			<Image src="/scraped-1.png" alt="Into the wild" fill className="object-cover" sizes="100vw" />
			<div className="absolute inset-0 bg-black/40" />

			{/* Content */}
			<div className="absolute inset-0 flex items-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="max-w-lg">
						<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
							Into the wild.
						</h2>
						<p className="text-white/80 text-base sm:text-lg leading-relaxed mb-2">
							We design durable travel apparel with a conscience — 100% made in America.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
