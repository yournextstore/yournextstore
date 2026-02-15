import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-foreground">
			<div className="relative aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5.5]">
				<Image
					src="/scraped-6.jpg"
					alt="Beauty and skincare"
					fill
					priority
					className="object-cover opacity-40"
					sizes="100vw"
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
					<p className="text-primary-foreground/70 text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">
						Blend beauty in you
					</p>
					<h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-light text-primary-foreground tracking-wide leading-tight">
						Get the skin you
						<br />
						want to feel
					</h1>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="mt-6 sm:mt-8 inline-flex items-center justify-center h-11 px-8 bg-primary-foreground text-foreground text-xs font-medium tracking-[0.15em] uppercase hover:bg-primary-foreground/90 transition-colors"
					>
						Shop Now
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
