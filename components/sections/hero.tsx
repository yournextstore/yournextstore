import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-mediterranean">
			{/* Soft horizon haze */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#8da3ad]/40 to-transparent"
			/>

			{/* Distant mountain silhouettes */}
			<svg
				aria-hidden="true"
				className="absolute bottom-[14%] left-0 right-0 w-full h-[28%]"
				viewBox="0 0 1440 220"
				preserveAspectRatio="none"
			>
				<title>Mountains</title>
				<defs>
					<linearGradient id="m1" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stopColor="#c1a48b" stopOpacity="0.55" />
						<stop offset="1" stopColor="#c1a48b" stopOpacity="0.05" />
					</linearGradient>
					<linearGradient id="m2" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stopColor="#8da3ad" stopOpacity="0.65" />
						<stop offset="1" stopColor="#8da3ad" stopOpacity="0.1" />
					</linearGradient>
				</defs>
				<path
					fill="url(#m1)"
					d="M0,140 L120,80 L240,120 L360,60 L500,110 L640,70 L780,120 L920,90 L1080,140 L1200,100 L1320,130 L1440,90 L1440,220 L0,220 Z"
				/>
				<path
					fill="url(#m2)"
					d="M0,170 L150,130 L280,160 L420,120 L560,160 L720,130 L860,170 L1010,140 L1170,180 L1300,150 L1440,170 L1440,220 L0,220 Z"
				/>
			</svg>

			{/* Sea reflection band */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-[#a8b7bf]/40 to-[#8da3ad]/70"
			/>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] py-12 sm:py-16 lg:py-20">
					{/* LEFT — Tagline */}
					<div className="relative z-20 max-w-[520px]">
						<h1 className="font-display text-[#e8b547] uppercase leading-[0.95] tracking-[0.02em] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl drop-shadow-[0_2px_0_rgba(199,148,34,0.25)]">
							A holiday
							<br />
							in every
							<br />
							find
						</h1>
						<p className="mt-8 max-w-sm font-script text-2xl sm:text-3xl text-[#1f46c2] leading-tight">
							curated for the long, slow afternoon
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-[#d8351f] text-[#f5e4d2] uppercase tracking-[0.22em] text-[11px] font-medium hover:bg-[#b62a17] transition-colors rounded-full"
							>
								Shop the edit
								<ArrowRightIcon className="h-3.5 w-3.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 border border-[#2a2622]/60 text-[#2a2622] uppercase tracking-[0.22em] text-[11px] font-medium hover:bg-[#2a2622] hover:text-[#f5e4d2] transition-colors rounded-full"
							>
								Our story
							</YnsLink>
						</div>
					</div>

					{/* CENTER — Sailboat (inline SVG) */}
					<svg
						aria-hidden="true"
						className="absolute z-10 left-[18%] sm:left-[20%] bottom-[16%] w-24 sm:w-32 lg:w-40 text-[#fbf3e6] animate-float-soft"
						viewBox="0 0 120 140"
						fill="none"
					>
						<title>Sailboat</title>
						<path d="M60 12 L60 100" stroke="#2a2622" strokeWidth="1.4" />
						<path d="M60 14 L60 96 L18 96 Z" fill="#fbf3e6" stroke="#2a2622" strokeWidth="1" />
						<path d="M60 22 L60 96 L96 96 Z" fill="#f3dec3" stroke="#2a2622" strokeWidth="1" opacity="0.95" />
						<path d="M22 102 L98 102 L88 116 L34 116 Z" fill="#2a2622" />
						<circle cx="60" cy="116" r="1.2" fill="#e8b547" />
					</svg>

					{/* Seagulls */}
					<svg
						aria-hidden="true"
						className="absolute z-10 top-[18%] left-[42%] w-16 text-[#2a2622] opacity-80"
						viewBox="0 0 60 24"
						fill="none"
					>
						<title>Seagull</title>
						<path
							d="M2 14 C 10 6, 16 6, 20 12 C 24 6, 30 6, 38 14"
							stroke="#2a2622"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
					<svg
						aria-hidden="true"
						className="absolute z-10 top-[34%] left-[34%] w-10 text-[#2a2622] opacity-70"
						viewBox="0 0 60 24"
						fill="none"
					>
						<title>Seagull</title>
						<path
							d="M2 14 C 10 6, 16 6, 20 12 C 24 6, 30 6, 38 14"
							stroke="#2a2622"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>

					{/* Sun */}
					<div
						aria-hidden="true"
						className="absolute z-0 top-[10%] right-[24%] w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#e8b547]/40 blur-2xl"
					/>

					{/* CENTER — Oversized cocktail coupe (inline SVG) */}
					<svg
						aria-hidden="true"
						className="absolute z-20 left-1/2 -translate-x-1/2 bottom-0 w-[340px] sm:w-[440px] lg:w-[560px]"
						viewBox="0 0 600 460"
						fill="none"
					>
						<title>Cocktail coupe</title>
						{/* glass bowl */}
						<defs>
							<linearGradient id="bowlGrad" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0" stopColor="#fbf3e6" stopOpacity="0.55" />
								<stop offset="0.45" stopColor="#e8b547" stopOpacity="0.85" />
								<stop offset="1" stopColor="#c79422" stopOpacity="0.95" />
							</linearGradient>
							<linearGradient id="bowlRim" x1="0" x2="1" y1="0" y2="0">
								<stop offset="0" stopColor="#fbf3e6" stopOpacity="0.9" />
								<stop offset="0.5" stopColor="#fbf3e6" stopOpacity="0.3" />
								<stop offset="1" stopColor="#fbf3e6" stopOpacity="0.9" />
							</linearGradient>
						</defs>
						<path
							d="M80 130 L520 130 L300 380 Z"
							fill="url(#bowlGrad)"
							stroke="#2a2622"
							strokeWidth="2"
							opacity="0.9"
						/>
						{/* liquid surface */}
						<ellipse cx="300" cy="130" rx="220" ry="14" fill="#e8b547" opacity="0.85" />
						<ellipse
							cx="300"
							cy="130"
							rx="220"
							ry="10"
							fill="none"
							stroke="url(#bowlRim)"
							strokeWidth="2.5"
						/>
						{/* stem */}
						<path d="M300 380 L300 430" stroke="#2a2622" strokeWidth="2.5" />
						{/* base */}
						<ellipse cx="300" cy="436" rx="80" ry="8" fill="#2a2622" />
						{/* olive on skewer */}
						<line x1="340" y1="60" x2="280" y2="190" stroke="#a8b7bf" strokeWidth="1.5" />
						<circle cx="280" cy="190" r="16" fill="#7b8b3a" />
						<circle cx="278" cy="187" r="3" fill="#d8351f" />
						<circle cx="340" cy="60" r="6" fill="none" stroke="#a8b7bf" strokeWidth="1.5" />
						{/* highlight */}
						<path
							d="M120 145 L300 360"
							stroke="#fbf3e6"
							strokeWidth="2"
							opacity="0.5"
							strokeLinecap="round"
						/>
					</svg>

					{/* RIGHT — Bottle silhouette */}
					<svg
						aria-hidden="true"
						className="absolute z-20 right-[6%] bottom-0 w-[140px] sm:w-[180px] lg:w-[220px] animate-float-soft"
						viewBox="0 0 200 480"
						fill="none"
					>
						<title>Bottle</title>
						<defs>
							<linearGradient id="bottleGrad" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0" stopColor="#fbf3e6" stopOpacity="0.6" />
								<stop offset="1" stopColor="#a8b7bf" stopOpacity="0.4" />
							</linearGradient>
						</defs>
						{/* cap */}
						<ellipse cx="100" cy="30" rx="36" ry="14" fill="#1f46c2" />
						<rect x="64" y="22" width="72" height="36" rx="6" fill="#1f46c2" />
						{/* neck */}
						<rect
							x="86"
							y="56"
							width="28"
							height="60"
							fill="url(#bottleGrad)"
							stroke="#2a2622"
							strokeWidth="1.2"
						/>
						{/* shoulder + body */}
						<path
							d="M86 116 L60 160 L60 440 Q 60 460 80 460 L120 460 Q 140 460 140 440 L140 160 L114 116 Z"
							fill="url(#bottleGrad)"
							stroke="#2a2622"
							strokeWidth="1.5"
						/>
						{/* label */}
						<rect x="64" y="240" width="72" height="92" fill="#fbf3e6" stroke="#2a2622" strokeWidth="1" />
						<text
							x="100"
							y="282"
							textAnchor="middle"
							fontFamily="serif"
							fontSize="14"
							fontWeight="700"
							fill="#d8351f"
							letterSpacing="2"
						>
							YOUR
						</text>
						<text
							x="100"
							y="300"
							textAnchor="middle"
							fontFamily="serif"
							fontSize="14"
							fontWeight="700"
							fill="#d8351f"
							letterSpacing="2"
						>
							NEXT
						</text>
						<text
							x="100"
							y="318"
							textAnchor="middle"
							fontFamily="serif"
							fontSize="10"
							fill="#1f46c2"
							letterSpacing="2"
						>
							STORE
						</text>
						{/* highlight */}
						<path d="M68 170 L68 430" stroke="#fbf3e6" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
					</svg>

					{/* RIGHT — Stamp badge */}
					<div className="absolute z-30 right-[2%] sm:right-[8%] top-[14%] w-28 h-28 sm:w-36 sm:h-36 animate-spin-slow">
						<svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
							<title>Stamp</title>
							<defs>
								<path id="circlePath" d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0" />
							</defs>
							<circle
								cx="100"
								cy="100"
								r="86"
								fill="none"
								stroke="#1f46c2"
								strokeWidth="1.5"
								strokeDasharray="4 6"
							/>
							<circle cx="100" cy="100" r="76" fill="none" stroke="#1f46c2" strokeWidth="1.5" />
							<text fill="#1f46c2" fontSize="14" fontFamily="serif" letterSpacing="6">
								<textPath href="#circlePath" startOffset="0%">
									• CURATED EDIT • EST. 2026 •
								</textPath>
							</text>
							<g transform="translate(100 100)">
								<circle r="22" fill="#e8b547" />
								<path
									d="M -16 4 Q 0 -8 16 4"
									fill="none"
									stroke="#1f46c2"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
								<path
									d="M -16 10 Q 0 2 16 10"
									fill="none"
									stroke="#1f46c2"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
							</g>
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}
