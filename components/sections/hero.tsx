import { ChevronDown, Play } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full h-[100svh] min-h-[640px] -mt-16 overflow-hidden bg-cinema-sky">
			{/* Stars layer */}
			<div className="absolute inset-0 bg-stardust opacity-70 animate-twinkle pointer-events-none" />

			{/* Painterly clouds via inline SVG */}
			<svg
				className="absolute inset-0 w-full h-full pointer-events-none"
				viewBox="0 0 1600 900"
				preserveAspectRatio="xMidYMid slice"
				aria-hidden="true"
			>
				<title>Night sky atmosphere</title>
				<defs>
					<radialGradient id="cloudA" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#b8b6ce" stopOpacity="0.35" />
						<stop offset="60%" stopColor="#6b6a8c" stopOpacity="0.18" />
						<stop offset="100%" stopColor="#0b1024" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="cloudB" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#9c9bbf" stopOpacity="0.28" />
						<stop offset="100%" stopColor="#1a1f3a" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="cloudC" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#2e2d52" stopOpacity="0.55" />
						<stop offset="100%" stopColor="#050817" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="moon" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f4f2f8" stopOpacity="0.5" />
						<stop offset="40%" stopColor="#b8b6ce" stopOpacity="0.15" />
						<stop offset="100%" stopColor="#0b1024" stopOpacity="0" />
					</radialGradient>
					<filter id="softBlur">
						<feGaussianBlur stdDeviation="14" />
					</filter>
				</defs>

				{/* Faint moonglow */}
				<ellipse cx="1180" cy="180" rx="260" ry="200" fill="url(#moon)" />

				{/* Layered clouds */}
				<g filter="url(#softBlur)">
					<ellipse cx="220" cy="380" rx="360" ry="160" fill="url(#cloudA)" />
					<ellipse cx="520" cy="200" rx="320" ry="120" fill="url(#cloudB)" />
					<ellipse cx="900" cy="520" rx="380" ry="170" fill="url(#cloudA)" />
					<ellipse cx="1280" cy="640" rx="340" ry="150" fill="url(#cloudB)" />
					<ellipse cx="320" cy="720" rx="420" ry="180" fill="url(#cloudC)" />
					<ellipse cx="1450" cy="320" rx="260" ry="120" fill="url(#cloudA)" />
					<ellipse cx="780" cy="780" rx="500" ry="160" fill="url(#cloudC)" />
				</g>
			</svg>

			{/* Vignette */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(5,8,23,0.55) 90%)",
				}}
			/>

			{/* Heading */}
			<div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
				<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
					New · Autumn Edition
				</p>
				<h1 className="font-serif text-balance text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-light text-foreground leading-[1.05]">
					Say hello to <em className="not-italic font-normal">Your Next Store.</em>
				</h1>
				<p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
					A tiny ritual, a quiet companion. Designed for late nights and longer walks.
				</p>
				<div className="mt-10 flex items-center gap-3">
					<YnsLink
						prefetch={"eager"}
						href="#what"
						className="btn-onyx inline-flex items-center justify-center gap-1.5 h-9 px-5 rounded-full text-[13px] font-medium text-foreground"
					>
						<Play className="h-3 w-3 fill-current" />
						Watch
						<span className="opacity-50">›</span>
					</YnsLink>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="btn-cobalt inline-flex items-center justify-center h-9 px-6 rounded-full text-[13px] font-medium text-white"
					>
						Shop the Edition
					</YnsLink>
				</div>
			</div>

			{/* Scroll-down chevron */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-scroll-hint">
				<ChevronDown className="h-4 w-4 text-muted-foreground/60" />
				<ChevronDown className="h-4 w-4 -mt-3 text-muted-foreground/30" />
			</div>
		</section>
	);
}
