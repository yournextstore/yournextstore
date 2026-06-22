import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative bg-hero-wash">
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-[0.18] mix-blend-soft-light bg-confetti"
				/>
				<div className="absolute inset-0 pointer-events-none">
					<svg
						className="absolute top-10 left-10 w-12 h-12 text-[#fcefa8] animate-wobble"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden
					>
						<path d="M12 2l2.5 6.5L21 9l-5 4.3L17.5 20 12 16.7 6.5 20 8 13.3 3 9l6.5-.5z" />
					</svg>
					<svg
						className="absolute bottom-16 right-16 w-16 h-16 text-[#3a4a8c]/30"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden
					>
						<path d="M12 2l2.5 6.5L21 9l-5 4.3L17.5 20 12 16.7 6.5 20 8 13.3 3 9l6.5-.5z" />
					</svg>
					<svg
						className="absolute top-1/3 right-1/4 w-8 h-8 text-white/40"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden
					>
						<circle cx="12" cy="12" r="10" />
					</svg>
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 lg:py-44">
					<div className="flex flex-col items-center text-center">
						<span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 text-[11px] tracking-[0.22em] font-bold uppercase text-[#e8456a] shadow-pop">
							<span aria-hidden>✦</span> Better-for-you, baked with joy
						</span>

						<h1 className="mt-6 font-heading font-black text-white text-4xl sm:text-6xl lg:text-7xl leading-[0.98] max-w-4xl drop-shadow-[0_4px_0_rgba(58,74,140,0.35)]">
							Classic cookies,
							<br />
							<span className="font-display text-[#fcefa8]">reimagined</span> with
							<br />
							chickpeas.
						</h1>

						<p className="mt-6 max-w-xl text-base sm:text-lg text-white/90 leading-relaxed">
							Wholesome, gluten-free cookie mixes made from real chickpeas. Bake the childhood classics you
							love — minus the regret.
						</p>

						<div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-[#fcefa8] text-[#e8456a] text-sm tracking-[0.2em] font-extrabold uppercase shadow-sticker hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform"
							>
								Shop Now
								<svg
									viewBox="0 0 24 24"
									className="w-4 h-4 transition-transform group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden
								>
									<path d="M5 12h14M13 5l7 7-7 7" />
								</svg>
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm tracking-[0.2em] font-extrabold uppercase border-2 border-white/60 hover:bg-white hover:text-[#3a4a8c] transition-colors"
							>
								Our story
							</YnsLink>
						</div>
					</div>
				</div>

				<svg
					className="absolute -bottom-px left-0 w-full h-8 text-[#fdf6cf]"
					viewBox="0 0 1200 40"
					preserveAspectRatio="none"
					aria-hidden
				>
					<path fill="currentColor" d="M0,30 Q150,5 300,20 T600,20 T900,18 T1200,28 L1200,40 L0,40 Z" />
				</svg>
			</div>
		</section>
	);
}
