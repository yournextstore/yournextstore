import { ArrowRight } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-[#0e0e0e] text-[#f2f2f2] jolt-grain">
			{/* Cinematic gradient backdrop evoking a B&W urban skate photograph */}
			<div
				aria-hidden
				className="absolute inset-0 -z-10"
				style={{
					backgroundImage: `
						radial-gradient(ellipse 100% 70% at 50% 30%, rgba(255,255,255,0.18), transparent 55%),
						radial-gradient(ellipse 80% 60% at 85% 80%, rgba(255,255,255,0.08), transparent 60%),
						linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 60%, #050505 100%)
					`,
				}}
			/>
			{/* SVG silhouette — abstract skateboarder/architecture mood */}
			<svg
				aria-hidden
				viewBox="0 0 1440 720"
				className="absolute inset-0 -z-10 h-full w-full opacity-50"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<linearGradient id="brick" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#3a3a3a" />
						<stop offset="1" stopColor="#111111" />
					</linearGradient>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#2a2a2a" />
						<stop offset="1" stopColor="#0e0e0e" />
					</linearGradient>
					<pattern id="windows" width="40" height="60" patternUnits="userSpaceOnUse">
						<rect width="40" height="60" fill="url(#brick)" />
						<rect x="6" y="8" width="12" height="20" fill="#1d1d1d" />
						<rect x="22" y="8" width="12" height="20" fill="#1d1d1d" />
						<rect x="6" y="36" width="12" height="20" fill="#1d1d1d" />
						<rect x="22" y="36" width="12" height="20" fill="#1d1d1d" />
					</pattern>
				</defs>
				<rect width="1440" height="720" fill="url(#sky)" />
				<rect x="0" y="60" width="280" height="660" fill="url(#windows)" />
				<rect x="1140" y="120" width="300" height="600" fill="url(#windows)" opacity="0.85" />
				{/* Concrete plinth */}
				<rect x="380" y="520" width="680" height="200" fill="#222" />
				<rect x="380" y="520" width="680" height="6" fill="#3a3a3a" />
				<rect x="380" y="700" width="680" height="20" fill="#101010" />
				{/* Skater silhouette - simple abstraction */}
				<g transform="translate(640, 200)" fill="#0a0a0a">
					<ellipse cx="80" cy="40" rx="22" ry="26" />
					<rect x="55" y="60" width="50" height="100" rx="6" />
					<rect x="40" y="160" width="80" height="20" rx="4" />
					<rect x="42" y="180" width="76" height="8" rx="4" fill="#1a1a1a" />
					<circle cx="55" cy="195" r="6" fill="#2a2a2a" />
					<circle cx="105" cy="195" r="6" fill="#2a2a2a" />
				</g>
			</svg>

			{/* Subtle vignette */}
			<div
				aria-hidden
				className="absolute inset-0 -z-10"
				style={{
					backgroundImage:
						"radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex min-h-[80vh] flex-col items-center justify-center py-24 text-center md:min-h-[88vh]">
					<span className="jolt-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-white/80 backdrop-blur-sm">
						<span className="h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
						Est. — Brewed for the bold
					</span>

					<h1 className="jolt-headline text-5xl sm:text-7xl lg:text-[7.5rem] text-white max-w-5xl jolt-fade-up">
						Everything happens
						<br />
						over coffee
					</h1>

					<p className="mt-8 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
						Your Next Store — simply great f*ing coffee, roasted dark, canned cold, shipped fresh from the
						curb to your kitchen.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="group inline-flex items-center justify-center gap-2 bg-[#ffcc00] px-10 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#0e0e0e] shadow-[0_8px_30px_rgba(255,204,0,0.25)] transition-all hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(255,204,0,0.4)]"
						>
							Buy&nbsp;Now
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#origin"
							className="inline-flex items-center justify-center gap-2 border border-white/30 bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
						>
							Our&nbsp;Story
						</YnsLink>
					</div>

					{/* Scroll cue */}
					<div className="mt-16 flex flex-col items-center gap-2 text-white/40">
						<span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
						<div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
					</div>
				</div>
			</div>

			{/* Bottom yellow bar — taxi-cab accent */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ffcc00]" />
		</section>
	);
}
