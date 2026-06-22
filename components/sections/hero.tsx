import { Star } from "lucide-react";
import { YnsLink } from "../yns-link";

const avatarGradients = [
	"linear-gradient(135deg, oklch(0.55 0.08 220) 0%, oklch(0.35 0.05 200) 100%)",
	"linear-gradient(135deg, oklch(0.7 0.16 45) 0%, oklch(0.45 0.12 35) 100%)",
	"linear-gradient(135deg, oklch(0.4 0.06 65) 0%, oklch(0.25 0.04 55) 100%)",
	"linear-gradient(135deg, oklch(0.5 0.05 85) 0%, oklch(0.3 0.03 70) 100%)",
	"linear-gradient(135deg, oklch(0.6 0.1 30) 0%, oklch(0.4 0.08 25) 100%)",
	"linear-gradient(135deg, oklch(0.75 0.09 75) 0%, oklch(0.5 0.07 65) 100%)",
	"linear-gradient(135deg, oklch(0.45 0.07 50) 0%, oklch(0.3 0.05 45) 100%)",
	"linear-gradient(135deg, oklch(0.65 0.13 40) 0%, oklch(0.42 0.1 35) 100%)",
];

const avatarInitials = ["LM", "AR", "TJ", "SN", "KO", "EM", "DV", "NB"];

export function Hero() {
	return (
		<section className="relative overflow-hidden silk-feather-bg min-h-[720px] sm:min-h-[780px] flex items-center justify-center">
			<div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
				{/* Avatar row */}
				<div className="flex items-center justify-center -space-x-3 sm:-space-x-4">
					{avatarGradients.map((bg, i) => (
						<div
							key={avatarInitials[i]}
							className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-cream/90 shadow-lg flex items-center justify-center text-cream font-serif text-sm tracking-wider"
							style={{ background: bg, zIndex: 10 - i }}
						>
							<span className="drop-shadow-sm">{avatarInitials[i]}</span>
						</div>
					))}
					<div
						className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-cream/90 shadow-lg flex items-center justify-center text-cream font-medium text-xs tracking-wider"
						style={{
							background: "linear-gradient(135deg, oklch(0.42 0.025 65) 0%, oklch(0.28 0.02 55) 100%)",
						}}
					>
						+3K
					</div>
				</div>

				{/* Star rating + social proof */}
				<div className="mt-8 sm:mt-10 flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={`star-${i}`}
								className="w-5 h-5 sm:w-6 sm:h-6 fill-terracotta text-terracotta drop-shadow"
								strokeWidth={1}
							/>
						))}
					</div>
					<p className="text-cream/90 text-xs sm:text-sm tracking-[0.22em] uppercase font-medium">
						Loved by 3000+ women like you
					</p>
				</div>

				{/* Headline */}
				<h1 className="mt-10 sm:mt-12 text-center font-serif text-cream text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[0.98] tracking-tight">
					<span>7 Nights to</span> <span className="italic font-serif text-cream">Stronger-Feeling</span>{" "}
					<span>Hair</span>
				</h1>

				{/* Subhead */}
				<p className="mt-7 sm:mt-9 text-center text-cream/85 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto font-light">
					Silk reduces friction while you sleep, helping hair retain moisture and break less over time.
				</p>

				{/* CTA */}
				<div className="mt-9 sm:mt-12 flex items-center justify-center">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center justify-center h-14 sm:h-16 px-12 sm:px-16 bg-terracotta text-espresso text-sm sm:text-base tracking-[0.22em] uppercase font-medium shadow-[0_10px_40px_-10px_rgba(232,148,96,0.6)] hover:bg-terracotta/90 hover:-translate-y-0.5 transition-all"
					>
						Start Your Silk Routine
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
