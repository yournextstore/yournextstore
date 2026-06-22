import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-midnight-silk text-[color:#f6efe2]">
			{/* Layered curtain folds */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 1440 760"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<linearGradient id="silk-1" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#081a2a" />
						<stop offset="40%" stopColor="#13405d" />
						<stop offset="70%" stopColor="#0c2a40" />
						<stop offset="100%" stopColor="#081827" />
					</linearGradient>
					<linearGradient id="silk-2" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
						<stop offset="100%" stopColor="rgba(255,255,255,0)" />
					</linearGradient>
					<radialGradient id="glow" cx="50%" cy="55%" r="60%">
						<stop offset="0%" stopColor="rgba(238,122,26,0.20)" />
						<stop offset="60%" stopColor="rgba(238,122,26,0)" />
					</radialGradient>
				</defs>
				<rect width="1440" height="760" fill="url(#silk-1)" />
				{/* Vertical drape folds */}
				{Array.from({ length: 22 }).map((_, i) => (
					<rect
						key={`fold-${i}`}
						x={i * 70 + Math.sin(i) * 8}
						y={-20}
						width={28 + (i % 3) * 6}
						height={800}
						fill="url(#silk-2)"
						opacity={0.35 + (i % 4) * 0.08}
					/>
				))}
				<rect width="1440" height="760" fill="url(#glow)" />
				{/* draped linen at bottom */}
				<path
					d="M0,580 C220,540 420,640 720,600 C1020,560 1240,640 1440,580 L1440,760 L0,760 Z"
					fill="#c9b79b"
					opacity="0.95"
				/>
				<path
					d="M0,580 C220,540 420,640 720,600 C1020,560 1240,640 1440,580 L1440,760 L0,760 Z"
					fill="url(#silk-2)"
				/>
			</svg>

			{/* Sauce bottle illustration on the right */}
			<svg
				aria-hidden="true"
				className="absolute bottom-0 right-[6%] hidden h-[70%] w-auto lg:block"
				viewBox="0 0 220 520"
				fill="none"
			>
				{/* Bottle cap */}
				<rect x="78" y="12" width="64" height="46" rx="6" fill="#ee7a1a" />
				<rect x="78" y="12" width="64" height="10" rx="2" fill="#d35f0a" />
				{/* Neck */}
				<rect x="92" y="58" width="36" height="40" fill="#7c1f12" />
				{/* Bottle body */}
				<path
					d="M70,98 Q70,82 92,82 L128,82 Q150,82 150,98 L150,470 Q150,500 110,500 Q70,500 70,470 Z"
					fill="#7c1f12"
				/>
				{/* Inner liquid sheen */}
				<path
					d="M82,108 Q82,94 96,94 L124,94 Q138,94 138,108 L138,460 Q138,488 110,488 Q82,488 82,460 Z"
					fill="#5e1108"
				/>
				{/* Highlight */}
				<rect x="86" y="120" width="6" height="320" rx="3" fill="#ee7a1a" opacity="0.35" />
				{/* Label */}
				<rect x="74" y="180" width="72" height="170" fill="#ee7a1a" />
				<rect x="74" y="180" width="72" height="170" fill="url(#silk-2)" />
				<text
					x="110"
					y="220"
					textAnchor="middle"
					fill="#7c1f12"
					fontFamily="Bodoni Moda, serif"
					fontWeight="900"
					fontSize="22"
					letterSpacing="2"
				>
					YOUR
				</text>
				<text
					x="110"
					y="248"
					textAnchor="middle"
					fill="#7c1f12"
					fontFamily="Bodoni Moda, serif"
					fontWeight="900"
					fontSize="22"
					letterSpacing="2"
				>
					NEXT
				</text>
				<text
					x="110"
					y="276"
					textAnchor="middle"
					fill="#7c1f12"
					fontFamily="Bodoni Moda, serif"
					fontWeight="900"
					fontSize="22"
					letterSpacing="2"
				>
					STORE
				</text>
				<text
					x="110"
					y="312"
					textAnchor="middle"
					fill="#7c1f12"
					fontFamily="Bodoni Moda, serif"
					fontStyle="italic"
					fontSize="20"
				>
					Hot Sauce
				</text>
				<text
					x="110"
					y="340"
					textAnchor="middle"
					fill="#7c1f12"
					fontFamily="Inter, sans-serif"
					fontSize="7"
					letterSpacing="1"
				>
					MADE IN ITALY · 5 FL OZ
				</text>
			</svg>

			{/* Decorative scattered fruit/peppers SVG */}
			<svg
				aria-hidden="true"
				className="absolute bottom-6 left-[8%] hidden h-[18%] w-auto md:block"
				viewBox="0 0 300 120"
			>
				{/* Grapes */}
				{Array.from({ length: 14 }).map((_, i) => (
					<circle
						key={`grape-${i}`}
						cx={20 + (i % 5) * 14 + (Math.floor(i / 5) % 2) * 7}
						cy={50 + Math.floor(i / 5) * 12}
						r="9"
						fill="#c9d186"
						opacity="0.9"
					/>
				))}
				{/* Cheese wedge */}
				<polygon points="120,70 180,40 200,90 130,100" fill="#f4d03a" opacity="0.9" />
				<polygon points="120,70 180,40 200,90 130,100" fill="#0f2a3f" opacity="0.08" />
				{/* Lemon */}
				<ellipse cx="240" cy="78" rx="22" ry="16" fill="#f4d03a" />
				<ellipse cx="240" cy="78" rx="14" ry="8" fill="#fff4b0" opacity="0.6" />
				{/* Chili */}
				<path d="M30,30 Q60,25 90,55 Q70,70 40,55 Q25,45 30,30 Z" fill="#ee7a1a" />
				<path d="M28,28 L24,18" stroke="#1a4630" strokeWidth="3" strokeLinecap="round" />
			</svg>

			{/* Hero content */}
			<div className="relative mx-auto max-w-[1280px] px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-10 lg:pb-40 lg:pt-32">
				<div className="max-w-2xl">
					<p className="divider-ornament text-[color:#c9b79b]">EST. ITALIA</p>
					<h1 className="mt-5 font-display text-[44px] font-medium leading-[1.02] tracking-[-0.01em] text-[color:#f6efe2] sm:text-[64px] lg:text-[84px]">
						A still life,
						<br />
						<span className="italic text-[color:#ee7a1a]">painted in fire.</span>
					</h1>
					<p className="mt-7 max-w-xl text-base leading-relaxed text-[color:#c9b79b] sm:text-lg">
						Slow-simmered Calabrian chilies, sun-ripened heirloom tomatoes, and Sicilian sea salt — bottled in
						the tradition of the Italian masters. Pour a little drama on dinner.
					</p>
					<div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:#ee7a1a] px-8 text-base font-semibold text-[color:#fff8ec] shadow-[0_8px_24px_-8px_rgba(238,122,26,0.65)] transition-transform hover:-translate-y-0.5"
						>
							Shop the Collection
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#story"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:#c9b79b]/40 px-8 text-base font-medium text-[color:#f6efe2] transition-colors hover:bg-white/5"
						>
							Our story
						</YnsLink>
					</div>
				</div>

				{/* Tiny credits row at bottom */}
				<div className="mt-16 hidden items-center gap-8 text-[11px] uppercase tracking-[0.32em] text-[color:#c9b79b]/70 md:flex">
					<span>Pressed slowly</span>
					<span className="h-px w-8 bg-[color:#c9b79b]/30" />
					<span>Bottled in Calabria</span>
					<span className="h-px w-8 bg-[color:#c9b79b]/30" />
					<span>Painted with fire</span>
				</div>
			</div>
		</section>
	);
}
