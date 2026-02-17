import Image from "next/image";

export function GiftCards() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Left: Text */}
				<div>
					<p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Gift cards</p>
					<h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
						Support your neighborhood
					</h2>
					<p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
						We believe that local businesses are an integral part of a neighborhood&apos;s character. Help
						keep us local by buying a gift card!
					</p>
					<a
						href="#products"
						className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-foreground/90 transition-colors"
					>
						Shop gift cards
					</a>
				</div>

				{/* Right: Images */}
				<div className="grid grid-cols-2 gap-4">
					<div className="relative aspect-[4/5] overflow-hidden">
						<Image
							src="/scraped-8.png"
							alt="Our store"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
					<div className="relative aspect-[4/5] overflow-hidden">
						<Image
							src="/scraped-9.png"
							alt="Gift card"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
