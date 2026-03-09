import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full">
			{/* Full-width hero image */}
			<div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
				<Image src="/scraped-13.png" alt="Organized desk setup" fill className="object-cover" priority />
				{/* Subtle overlay */}
				<div className="absolute inset-0 bg-black/15" />

				{/* Hero content - centered */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center px-6">
						<h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-wide">
							Get more organized
						</h1>
						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center gap-3 border border-white text-white px-8 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-foreground transition-all duration-300"
							>
								Shop the collection
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
