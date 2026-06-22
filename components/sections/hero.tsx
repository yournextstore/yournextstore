import Image from "next/image";
import { YnsLink } from "../yns-link";

function Butterfly() {
	return (
		<svg
			viewBox="0 0 320 380"
			className="absolute -left-12 sm:-left-20 -bottom-16 w-[260px] sm:w-[340px] lg:w-[420px] z-30 animate-flutter pointer-events-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)]"
			aria-hidden="true"
		>
			<title>Iridescent butterfly</title>
			<defs>
				<radialGradient id="wingTop" cx="35%" cy="40%" r="70%">
					<stop offset="0%" stopColor="#7fe0f8" />
					<stop offset="40%" stopColor="#3fb9ea" />
					<stop offset="80%" stopColor="#1f4ea8" />
					<stop offset="100%" stopColor="#0d1f4d" />
				</radialGradient>
				<radialGradient id="wingBot" cx="40%" cy="40%" r="80%">
					<stop offset="0%" stopColor="#ff8fd9" />
					<stop offset="50%" stopColor="#a838c0" />
					<stop offset="100%" stopColor="#3a0d4f" />
				</radialGradient>
				<linearGradient id="wingShine" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
					<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
				</linearGradient>
			</defs>

			{/* upper wing */}
			<path
				d="M170 130 C 110 40, 30 30, 10 90 C -8 150, 30 210, 130 210 C 165 210, 175 195, 175 175 Z"
				fill="url(#wingTop)"
			/>
			<path
				d="M170 130 C 110 40, 30 30, 10 90 C -8 150, 30 210, 130 210 C 165 210, 175 195, 175 175 Z"
				fill="url(#wingShine)"
			/>
			{/* white edge dots */}
			<g fill="#f7f1d8">
				<circle cx="40" cy="90" r="3" />
				<circle cx="60" cy="80" r="2.5" />
				<circle cx="80" cy="75" r="2" />
				<circle cx="100" cy="78" r="2.5" />
				<circle cx="50" cy="170" r="3" />
				<circle cx="90" cy="190" r="2.5" />
			</g>
			{/* lower wing */}
			<path
				d="M170 200 C 130 250, 50 290, 30 350 C 25 365, 60 380, 110 360 C 150 345, 175 290, 175 240 Z"
				fill="url(#wingBot)"
			/>
			<path
				d="M170 200 C 130 250, 50 290, 30 350 C 25 365, 60 380, 110 360 C 150 345, 175 290, 175 240 Z"
				fill="url(#wingShine)"
				opacity="0.7"
			/>
			{/* body */}
			<ellipse cx="178" cy="225" rx="9" ry="80" fill="#1c1130" />
			<circle cx="178" cy="148" r="9" fill="#1c1130" />
			{/* antennae */}
			<path
				d="M178 144 C 188 120, 210 110, 230 100"
				stroke="#1c1130"
				strokeWidth="2"
				fill="none"
				strokeLinecap="round"
			/>
			<path
				d="M178 144 C 168 122, 150 112, 130 102"
				stroke="#1c1130"
				strokeWidth="2"
				fill="none"
				strokeLinecap="round"
			/>
			<circle cx="232" cy="100" r="3" fill="#f5c518" />
			<circle cx="128" cy="102" r="3" fill="#f5c518" />
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative bg-[var(--tropic-cyan)] overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
				<div className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#163d1d]">
					<Image
						src="/scraped-0.jpg"
						alt="Adventure with plant powered protection"
						fill
						priority
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover"
					/>
					{/* Cinematic overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

					{/* Centered CTA pill */}
					<div className="absolute inset-0 flex items-center justify-center">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center px-8 sm:px-10 h-12 sm:h-14 bg-[var(--tropic-yellow)] text-[#15323b] rounded-full text-base sm:text-lg font-semibold hover:bg-[#ffd62b] transition-all hover:scale-105 active:scale-100 shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
						>
							Shop the Adventure
						</YnsLink>
					</div>

					{/* Corner badges */}
					<div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white border border-white/25">
						<span className="h-1.5 w-1.5 rounded-full bg-[var(--tropic-yellow)] animate-pulse" />
						New Drop · Summer ’26
					</div>
					<div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white border border-white/25">
						DEET-free · Reef-safe
					</div>
				</div>
			</div>

			{/* Plant Powered, Protection band */}
			<div className="relative">
				<Butterfly />
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
						<h1 className="font-display italic text-white text-[44px] sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight pl-32 sm:pl-44 lg:pl-64">
							Plant Powered,
							<br />
							Protection
						</h1>

						<div className="flex items-center gap-6 sm:gap-8 self-end lg:self-auto">
							<DurationBadge label="4hr" icon="bug" />
							<DurationBadge label="8hr" icon="mosquito" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function DurationBadge({ label, icon }: { label: string; icon: "bug" | "mosquito" }) {
	return (
		<div className="relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-[var(--tropic-cyan)] border-[3px] border-white/95 shadow-[0_0_0_2px_rgba(255,255,255,0.4)_inset,0_8px_24px_rgba(0,0,0,0.25)]">
			<div className="absolute inset-1.5 rounded-full border border-white/55" />
			<div className="flex flex-col items-center text-white">
				{icon === "bug" ? (
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<title>Bug</title>
						<ellipse cx="12" cy="14" rx="6" ry="7" fill="currentColor" />
						<path
							d="M12 8 V5 M9 4 L12 6 M15 4 L12 6"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
						<path
							d="M5 12 H2 M19 12 H22 M5 16 H2 M19 16 H22"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
				) : (
					<svg width="26" height="22" viewBox="0 0 32 22" fill="none" aria-hidden="true">
						<title>Mosquito</title>
						<ellipse cx="16" cy="14.5" rx="4" ry="2.4" fill="currentColor" />
						<ellipse
							cx="22"
							cy="7"
							rx="6"
							ry="2.4"
							fill="currentColor"
							opacity="0.5"
							transform="rotate(-18 22 7)"
						/>
						<ellipse
							cx="10"
							cy="7"
							rx="6"
							ry="2.4"
							fill="currentColor"
							opacity="0.5"
							transform="rotate(18 10 7)"
						/>
						<path d="M16 14 L16 21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
					</svg>
				)}
				<span className="font-display text-2xl sm:text-3xl font-semibold leading-none mt-1">{label}</span>
			</div>
		</div>
	);
}
