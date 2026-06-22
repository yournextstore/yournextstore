import { Star } from "lucide-react";

export function Intro() {
	return (
		<section className="bg-background">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 text-center">
				<span className="inline-flex items-center gap-2 rounded-full bg-sage/60 px-3.5 py-1 text-[11px] font-medium tracking-widest uppercase text-cocoa ring-1 ring-cocoa/10">
					<span className="h-1 w-1 rounded-full bg-cocoa/60" aria-hidden="true" />
					Botanicals, Evolved
				</span>
				<p className="mt-5 font-serif text-xl sm:text-2xl lg:text-[28px] leading-snug text-cocoa max-w-3xl mx-auto">
					Your Next Store nurtures and balances daily wellness rituals with formulations rooted in prebiotic
					nutrients, vitamins, minerals and quietly powerful antioxidants.
				</p>
				<div className="mt-6 flex items-center justify-center gap-2 text-sm text-cocoa/80">
					<div className="flex items-center gap-0.5 text-terracotta">
						{Array.from({ length: 4 }).map((_, i) => (
							<Star key={`star-${i}`} className="h-4 w-4 fill-current" />
						))}
						<svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
							<defs>
								<linearGradient id="half-star">
									<stop offset="50%" stopColor="currentColor" />
									<stop offset="50%" stopColor="transparent" />
								</linearGradient>
							</defs>
							<path
								d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								fill="url(#half-star)"
								stroke="currentColor"
								strokeWidth="1.2"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<span className="text-cocoa/70">758 reviews</span>
				</div>
			</div>
		</section>
	);
}
