import Image from "next/image";

export function TextWithImage() {
	return (
		<section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Text */}
				<div className="max-w-lg">
					<h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-wide mb-6">
						Everything within reach.
					</h2>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Our modular system means there&apos;s a place for all the desk accessories you frequently reach
						for. Pens, paper, headphones, and more. Designed to keep your workspace clean and your mind clear.
					</p>
				</div>

				{/* Image */}
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src="/scraped-5.png"
						alt="Organized workspace with shelving"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
			</div>
		</section>
	);
}
