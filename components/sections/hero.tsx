import Image from "next/image";

export function Hero() {
	return (
		<section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
			{/* Background Image */}
			<Image
				src="/scraped-0.png"
				alt="Adventure landscape"
				fill
				className="object-cover animate-kenburns"
				priority
			/>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/30" />

			{/* Content */}
			<div className="absolute inset-0 flex items-center justify-center text-center">
				<div className="max-w-3xl px-4">
					<p className="text-white/80 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-medium">
						Your Next Store
					</p>
					<h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
						The adventurous.
					</h1>
				</div>
			</div>
		</section>
	);
}
