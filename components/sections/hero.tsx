import { ArrowRightIcon } from "lucide-react";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

export function Hero({ preview = false }: { preview?: boolean }) {
	return (
		<section className="relative overflow-hidden bg-hero-travertine text-[#f4efe6] min-h-[72vh] lg:min-h-[88vh] flex items-center">
			{/* Layered abstract still-life background */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 w-full h-full"
				preserveAspectRatio="xMidYMid slice"
				viewBox="0 0 1440 900"
			>
				<defs>
					<radialGradient id="glow" cx="22%" cy="42%" r="38%">
						<stop offset="0%" stopColor="#c9a87c" stopOpacity="0.55" />
						<stop offset="60%" stopColor="#8b6b4a" stopOpacity="0.12" />
						<stop offset="100%" stopColor="#1a1410" stopOpacity="0" />
					</radialGradient>
					<linearGradient id="travertine" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#3d2e22" />
						<stop offset="55%" stopColor="#1a1410" />
						<stop offset="100%" stopColor="#0a0807" />
					</linearGradient>
				</defs>
				<rect width="1440" height="900" fill="url(#travertine)" />
				<ellipse cx="320" cy="380" rx="520" ry="320" fill="url(#glow)" />
				{/* Candle silhouette */}
				<g opacity="0.55">
					<rect x="1040" y="380" width="120" height="280" rx="8" fill="#c9a87c" opacity="0.18" />
					<rect x="1052" y="380" width="96" height="280" rx="6" fill="#8b6b4a" opacity="0.22" />
					<path d="M 1100 380 Q 1090 348 1100 320 Q 1110 348 1100 380 Z" fill="#f4efe6" opacity="0.85">
						<animate attributeName="opacity" values="0.85;0.6;0.85" dur="4s" repeatCount="indefinite" />
					</path>
					{/* smoke wisps */}
					<path
						d="M 1100 320 Q 1080 280 1110 240 Q 1130 200 1095 160"
						stroke="#f4efe6"
						strokeWidth="1.2"
						fill="none"
						opacity="0.18"
					/>
				</g>
				{/* horizontal travertine ledge */}
				<rect x="0" y="660" width="1440" height="240" fill="#c9a87c" opacity="0.06" />
				<rect x="0" y="660" width="1440" height="2" fill="#c9a87c" opacity="0.25" />
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 sm:py-28 lg:py-36">
				<div className="max-w-2xl">
					<p className="text-[11px] tracking-luxe uppercase text-[#c9a87c] mb-6">
						The Maison Collection · Édition Hiver
					</p>
					<h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.02] text-balance text-[#f4efe6]">
						Light, slowed
						<br />
						<em className="italic font-light text-[#e8dcc8]">to the rhythm</em>
						<br />
						of a quiet room.
					</h1>
					<p className="mt-8 text-lg sm:text-xl leading-relaxed text-[#e8dcc8]/85 max-w-lg font-light">
						Hand-poured candles and home fragrance, blended in small batches from natural wax, single-origin
						oils, and ingredients you can trace by hand.
					</p>
					<div className="mt-12 flex flex-col sm:flex-row gap-4">
						<YnsLink
							prefetch={"eager"}
							href={previewHref("/products", preview)}
							className="inline-flex items-center justify-center gap-3 h-12 px-9 bg-[#f4efe6] text-[#1a1410] text-xs tracking-luxe uppercase font-medium hover:bg-[#c9a87c] transition-colors duration-500"
						>
							Shop the collection
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href={previewHref("/#story", preview)}
							className="inline-flex items-center justify-center gap-2 h-12 px-9 border border-[#c9a87c]/40 text-[#f4efe6] text-xs tracking-luxe uppercase font-medium hover:border-[#c9a87c] hover:bg-[#c9a87c]/10 transition-colors duration-500"
						>
							Our craft
						</YnsLink>
					</div>
				</div>
			</div>
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#c9a87c]/60 text-[10px] tracking-luxe uppercase">
				<span>Scroll</span>
				<div className="h-8 w-px bg-[#c9a87c]/30" />
			</div>
		</section>
	);
}
