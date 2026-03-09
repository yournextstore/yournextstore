import Image from "next/image";
import { YnsLink } from "../yns-link";

export function GiftCards() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
				{/* Text */}
				<div>
					<p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Gift cards</p>
					<h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mb-4">
						Support your neighborhood
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-8">
						We believe that local businesses are an integral part of a neighborhood&apos;s character. Help
						keep us local by buying a gift card!
					</p>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="inline-flex items-center justify-center h-10 px-6 bg-foreground text-primary-foreground text-xs tracking-widest uppercase hover:bg-foreground/90 transition-colors"
					>
						Shop gift cards
					</YnsLink>
				</div>

				{/* Images */}
				<div className="grid grid-cols-2 gap-4">
					<div className="relative aspect-square overflow-hidden">
						<Image
							src="/scraped-3.png"
							alt="Store front"
							fill
							sizes="(max-width: 1024px) 50vw, 25vw"
							className="object-cover"
						/>
					</div>
					<div className="relative aspect-square overflow-hidden">
						<Image
							src="/scraped-4.png"
							alt="Gift card"
							fill
							sizes="(max-width: 1024px) 50vw, 25vw"
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
