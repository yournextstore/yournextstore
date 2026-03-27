import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden">
			{/* Main hero slide */}
			<div className="relative h-[60vh] min-h-[450px] sm:h-[70vh] lg:h-[85vh]">
				<Image
					src="/scraped-0.png"
					alt="Your skin's best solutions"
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
				<div className="absolute inset-0 flex items-center">
					<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="max-w-xl">
							<h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
								Your Skin&apos;s Best Solutions for Every Concern
							</h1>
							<div className="mt-8">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-block bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cream"
								>
									Shop Now
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Secondary banner */}
			<div className="relative h-[40vh] min-h-[300px] sm:h-[50vh] lg:h-[65vh]">
				<Image
					src="/scraped-1.png"
					alt="Upgrade your skincare game with our bundles"
					fill
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
				<div className="absolute inset-0 flex items-center">
					<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="max-w-lg">
							<h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
								Upgrade Your Skincare Game with Our Bundles!
							</h2>
							<div className="mt-6">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-block bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cream"
								>
									Shop Bundles
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
