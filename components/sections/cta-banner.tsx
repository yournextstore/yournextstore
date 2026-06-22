import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function CtaBanner() {
	return (
		<section className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
				<div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px]">
					{/* Painted backdrop */}
					<div aria-hidden className="absolute inset-0">
						<svg
							viewBox="0 0 1200 360"
							preserveAspectRatio="xMidYMid slice"
							className="absolute inset-0 w-full h-full"
						>
							<defs>
								<linearGradient id="ctaGrad" x1="0" y1="0" x2="1" y2="1">
									<stop offset="0%" stopColor="#5b6b3a" />
									<stop offset="55%" stopColor="#3a4a23" />
									<stop offset="100%" stopColor="#202a12" />
								</linearGradient>
								<radialGradient id="ctaSun" cx="20%" cy="30%" r="55%">
									<stop offset="0%" stopColor="#f4d979" stopOpacity="0.55" />
									<stop offset="100%" stopColor="#f4d979" stopOpacity="0" />
								</radialGradient>
							</defs>
							<rect width="1200" height="360" fill="url(#ctaGrad)" />
							<circle cx="240" cy="120" r="260" fill="url(#ctaSun)" />
							<g opacity="0.18" stroke="#c8db3c" strokeWidth="1" fill="none">
								<path d="M0 280 C 200 250 400 310 600 280 S 1000 250 1200 290" />
								<path d="M0 310 C 200 280 400 340 600 310 S 1000 280 1200 320" />
								<path d="M0 340 C 200 310 400 370 600 340 S 1000 310 1200 350" />
							</g>
						</svg>
					</div>

					<div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 sm:p-12 lg:p-14">
						<div className="max-w-xl">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--lime)]">
								Free design consultation
							</p>
							<h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white text-balance">
								Have a question for us? Let us know!
							</h2>
							<p className="mt-3 text-white/75 text-[15px] max-w-md">
								Send us your roof photo and last electric bill — we'll mock up a system, savings estimate and
								timeline within 24 hours.
							</p>
						</div>
						<div className="flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[var(--lime)] text-[var(--forest-deep)] font-semibold hover:brightness-95 transition shadow-lg shadow-black/20"
							>
								Get a free quote
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							<a
								href="tel:+18005551234"
								className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white/10 backdrop-blur border border-white/25 text-white hover:bg-white/20 transition"
							>
								Call 1-800-555-SOLAR
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
