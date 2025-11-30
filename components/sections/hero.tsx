import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 lg:py-28">
					<div className="max-w-2xl">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
							Curated essentials for modern living
						</h1>
						<p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
							Discover our thoughtfully designed collection of premium products, crafted with care and built
							to last.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-4">
							<Link
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-foreground text-primary-foreground rounded-full text-base font-medium hover:bg-foreground/90 transition-colors"
							>
								Shop Collection
								<ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								href="#about"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-border rounded-full text-base font-medium hover:bg-secondary transition-colors"
							>
								Our Story
							</Link>
						</div>
					</div>
				</div>
			</div>
			{/* Subtle decorative element */}
			<div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent pointer-events-none hidden lg:block" />
		</section>
	);
}
