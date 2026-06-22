import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#f7f3ef]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative py-16 sm:py-20 lg:py-28 flex items-center justify-center text-center">
					<div className="absolute inset-0 opacity-[0.04]">
						<svg className="w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
							<circle cx="720" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="0.5" />
							<circle cx="720" cy="300" r="200" fill="none" stroke="currentColor" strokeWidth="0.5" />
							<circle cx="720" cy="300" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
						</svg>
					</div>

					<div className="relative z-10 max-w-2xl mx-auto">
						<p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-foreground/50 mb-4">
							Limited Time: Online Only!
						</p>
						<div className="mb-6">
							<span className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground block leading-[0.9]">
								FINAL
							</span>
							<span className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground block leading-[0.9]">
								CLEARANCE
							</span>
						</div>
						<p className="text-sm sm:text-base text-foreground/60 mb-8 max-w-md mx-auto">
							Take 20% Off &apos;Sale Must-Haves&apos;
						</p>
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-block bg-foreground text-primary-foreground px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-foreground/85 transition-colors"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
