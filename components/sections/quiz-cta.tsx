import { YnsLink } from "../yns-link";

export function QuizCta() {
	return (
		<section id="quiz" className="bg-[#fef7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="relative overflow-hidden rounded-[2.5rem] bg-purple-cta px-8 py-16 sm:px-16 sm:py-20 text-center">
					<span
						aria-hidden="true"
						className="absolute top-8 left-10 w-12 h-12 rotate-12 bg-[#f5c518] rounded-sm opacity-80"
					/>
					<span
						aria-hidden="true"
						className="absolute bottom-10 right-12 w-14 h-14 -rotate-12 bg-[#f4884a] rounded-sm opacity-80"
					/>
					<span
						aria-hidden="true"
						className="absolute top-1/2 left-6 w-8 h-8 -translate-y-1/2 rotate-45 bg-white/15 rounded-sm"
					/>
					<span
						aria-hidden="true"
						className="absolute top-12 right-1/3 w-6 h-6 rotate-12 bg-[#f5c518]/50 rounded-sm"
					/>

					<div className="relative max-w-2xl mx-auto">
						<p className="font-marker text-[#f5c518] text-xl mb-3 -rotate-2">90 seconds</p>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
							Not sure which strip{" "}
							<span className="font-marker text-[#f4884a] inline-block rotate-2">is yours?</span>
						</h2>
						<p className="mt-5 text-white/80 text-base sm:text-lg max-w-md mx-auto">
							Answer five quick questions and we&apos;ll build a personalized stack — plus 20% off your first
							order.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
							<YnsLink
								prefetch="eager"
								href="#quiz"
								className="inline-flex items-center justify-center gap-2 h-12 px-10 bg-[#f5c518] text-[#1a0f4d] rounded-full text-xs font-extrabold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_6px_0_#1a0f4d] hover:shadow-[0_3px_0_#1a0f4d] hover:translate-y-[3px]"
							>
								Take The Quiz
							</YnsLink>
							<YnsLink
								prefetch="eager"
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-10 bg-transparent border-2 border-white/30 text-white rounded-full text-xs font-extrabold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
							>
								Browse All
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
