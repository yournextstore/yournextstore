import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden">
			{/* Banquette (tufted maroon) backdrop */}
			<div aria-hidden="true" className="yns-banquette absolute inset-x-0 top-0 h-[58%]" />
			{/* Plaster surface foreground */}
			<div aria-hidden="true" className="yns-plaster absolute inset-x-0 bottom-0 h-[42%]" />

			{/* Decorative scattered "ingredients" — pure SVG so it stays crisp */}
			<svg
				aria-hidden="true"
				viewBox="0 0 1440 720"
				preserveAspectRatio="xMidYMax slice"
				className="absolute inset-x-0 bottom-0 z-0 h-[42%] w-full text-[#A85533]"
			>
				<title>Scattered grains</title>
				{Array.from({ length: 24 }).map((_, i) => {
					const cx = 80 + ((i * 53) % 1320);
					const cy = 540 + ((i * 31) % 160);
					const r = 1.5 + ((i * 7) % 4);
					return (
						<ellipse
							key={`g-${i}`}
							cx={cx}
							cy={cy}
							rx={r * 2}
							ry={r}
							fill="currentColor"
							opacity={0.35}
							transform={`rotate(${(i * 23) % 360} ${cx} ${cy})`}
						/>
					);
				})}
			</svg>

			<div className="relative mx-auto max-w-7xl px-4 pt-12 pb-0 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
				{/* Stacked product lineup */}
				<div className="relative mx-auto flex h-[420px] w-full items-end justify-center gap-3 sm:h-[480px] sm:gap-6 lg:h-[560px]">
					{/* Left bowl (granola) */}
					<HeroBowl
						className="hidden -translate-y-2 sm:block"
						fill="#E8B57E"
						accent="#7A3D1F"
						label="Granola"
					/>

					{/* Pouch 1 - terracotta */}
					<HeroPouch
						color="#D86A4B"
						label="GRANOLA"
						sublabel="Your Next Store"
						kicker="Ghee Roasted"
						illustration="winged"
						className="z-10 h-[280px] w-[150px] -rotate-3 sm:h-[340px] sm:w-[190px] lg:h-[420px] lg:w-[230px]"
					/>

					{/* Pouch 2 (hero, marigold) */}
					<HeroPouch
						color="#E8A22A"
						label="GRANOLA"
						sublabel="YOUR NEXT STORE"
						kicker="Ghee Roasted"
						illustration="winged"
						className="z-20 h-[340px] w-[200px] sm:h-[400px] sm:w-[250px] lg:h-[500px] lg:w-[300px]"
					/>

					{/* Chocolate bar */}
					<HeroChocolate className="z-10 h-[260px] w-[110px] sm:h-[320px] sm:w-[140px] lg:h-[400px] lg:w-[180px]" />

					{/* Crunch bar */}
					<HeroCrunchBar className="z-10 h-[180px] w-[100px] -rotate-6 sm:h-[220px] sm:w-[130px] lg:h-[260px] lg:w-[160px]" />

					{/* Right bowl (popcorn) */}
					<HeroBowl
						className="hidden translate-y-2 sm:block"
						fill="#F2E0B8"
						accent="#A07033"
						label="Popcorn"
					/>
				</div>

				{/* Headline overlay */}
				<div className="relative -mt-24 pb-16 sm:-mt-28 sm:pb-20 lg:-mt-32 lg:pb-28">
					<h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-[#FAF2E6] sm:text-5xl lg:text-6xl">
						Savor every. <br />
						Last. Bite.
					</h1>
					<div className="mt-6">
						<YnsLink
							prefetch="eager"
							href="/products"
							className="inline-flex items-center gap-2 rounded-full bg-[#8C1F2A] px-7 py-3 text-sm font-semibold text-[#FAF2E6] shadow-[0_6px_0_rgba(0,0,0,0.18)] transition-all hover:-translate-y-[1px] hover:bg-[#A52738] hover:shadow-[0_8px_0_rgba(0,0,0,0.22)]"
						>
							Shop all
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}

function HeroPouch({
	color,
	label,
	sublabel,
	kicker,
	className,
	illustration: _illustration,
}: {
	color: string;
	label: string;
	sublabel: string;
	kicker: string;
	className?: string;
	illustration?: "winged" | "trees";
}) {
	return (
		<div className={`relative drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] ${className ?? ""}`}>
			<svg viewBox="0 0 200 360" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
				<title>{label} pouch</title>
				{/* Pouch body */}
				<defs>
					<linearGradient id={`g-${color}`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={color} stopOpacity="1" />
						<stop offset="100%" stopColor={color} stopOpacity="0.85" />
					</linearGradient>
					<radialGradient id={`hi-${color}`} cx="0.3" cy="0.2" r="0.5">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
					</radialGradient>
				</defs>
				{/* top crimp */}
				<path
					d="M 18 18 Q 100 0 182 18 L 178 36 Q 100 22 22 36 Z"
					fill={color}
					stroke="rgba(0,0,0,0.25)"
					strokeWidth="0.5"
				/>
				{/* main body */}
				<path
					d="M 22 36 Q 18 50 18 80 L 14 320 Q 14 348 32 348 L 168 348 Q 186 348 186 320 L 182 80 Q 182 50 178 36 Q 100 22 22 36 Z"
					fill={`url(#g-${color})`}
				/>
				<path
					d="M 22 36 Q 18 50 18 80 L 14 320 Q 14 348 32 348 L 168 348 Q 186 348 186 320 L 182 80 Q 182 50 178 36 Q 100 22 22 36 Z"
					fill={`url(#hi-${color})`}
				/>
				{/* Kicker */}
				<text
					x="100"
					y="78"
					textAnchor="middle"
					fontFamily="Inter, sans-serif"
					fontSize="9"
					fontWeight="700"
					letterSpacing="1.5"
					fill="#FAF2E6"
				>
					{kicker.toUpperCase()}
				</text>
				{/* Label */}
				<text
					x="100"
					y="110"
					textAnchor="middle"
					fontFamily="Fraunces, serif"
					fontSize="26"
					fontWeight="900"
					fill="#3C5A8E"
					letterSpacing="0.5"
				>
					{sublabel.slice(0, 12).toUpperCase()}
				</text>
				<text
					x="100"
					y="146"
					textAnchor="middle"
					fontFamily="Fraunces, serif"
					fontSize="32"
					fontWeight="900"
					fill="#3C5A8E"
					letterSpacing="1"
				>
					{label}
				</text>

				{/* Folk-art illustration circle */}
				<circle cx="100" cy="220" r="58" fill="#F2C9A8" stroke="#8C1F2A" strokeWidth="1.5" />
				{/* trees */}
				<path d="M 60 246 Q 65 226 70 246 Z" fill="#3C5A8E" />
				<path d="M 130 246 Q 135 222 140 246 Z" fill="#3C5A8E" />
				<circle cx="78" cy="232" r="4" fill="#8C1F2A" />
				<circle cx="122" cy="230" r="4" fill="#8C1F2A" />
				{/* sun behind */}
				<circle cx="100" cy="208" r="20" fill="#E8A22A" />
				{/* winged figure */}
				<ellipse cx="100" cy="230" rx="6" ry="9" fill="#FAF2E6" />
				<circle cx="100" cy="218" r="4" fill="#F2C9A8" stroke="#2A2A2A" strokeWidth="0.5" />
				<path
					d="M 92 230 Q 80 224 78 234 Q 86 232 92 234 Z"
					fill="#FAF2E6"
					stroke="#2A2A2A"
					strokeWidth="0.5"
				/>
				<path
					d="M 108 230 Q 120 224 122 234 Q 114 232 108 234 Z"
					fill="#FAF2E6"
					stroke="#2A2A2A"
					strokeWidth="0.5"
				/>

				{/* Footer band */}
				<text
					x="100"
					y="306"
					textAnchor="middle"
					fontFamily="Inter, sans-serif"
					fontSize="7"
					fontWeight="700"
					letterSpacing="1.2"
					fill="#FAF2E6"
				>
					ORGANIC • REAL INGREDIENTS • GLUTEN FREE
				</text>
				<text
					x="100"
					y="326"
					textAnchor="middle"
					fontFamily="Inter, sans-serif"
					fontSize="6"
					letterSpacing="1"
					fill="#FAF2E6"
					opacity="0.7"
				>
					NET WT. 12 OZ (345 G)
				</text>
			</svg>
		</div>
	);
}

function HeroChocolate({ className }: { className?: string }) {
	return (
		<div className={`relative drop-shadow-[0_18px_24px_rgba(0,0,0,0.3)] ${className ?? ""}`}>
			<svg viewBox="0 0 140 320" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
				<title>Chocolate bar</title>
				{/* Wrapper highlight */}
				<rect x="6" y="10" width="128" height="300" rx="6" fill="#3A1F12" />
				{/* Chocolate grid */}
				{Array.from({ length: 8 }).map((_, row) =>
					Array.from({ length: 4 }).map((_, col) => (
						<rect
							key={`c-${row}-${col}`}
							x={14 + col * 28}
							y={18 + row * 36}
							width="24"
							height="32"
							rx="3"
							fill="#4A2A18"
							stroke="#2A1408"
							strokeWidth="1"
						/>
					)),
				)}
				{/* clear film highlight */}
				<rect x="6" y="10" width="128" height="300" rx="6" fill="url(#filmHi)" opacity="0.18" />
				<defs>
					<linearGradient id="filmHi" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
}

function HeroCrunchBar({ className }: { className?: string }) {
	return (
		<div className={`relative drop-shadow-[0_14px_18px_rgba(0,0,0,0.25)] ${className ?? ""}`}>
			<svg viewBox="0 0 160 220" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
				<title>Crunch bar</title>
				<rect x="6" y="10" width="148" height="200" rx="10" fill="#E37BA5" />
				<rect x="6" y="10" width="148" height="200" rx="10" fill="url(#crunchHi)" opacity="0.2" />
				<defs>
					<linearGradient id="crunchHi" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
					</linearGradient>
				</defs>
				<text
					x="80"
					y="76"
					textAnchor="middle"
					fontFamily="Fraunces, serif"
					fontSize="20"
					fontWeight="900"
					fill="#FAF2E6"
				>
					YNS
				</text>
				<text
					x="80"
					y="104"
					textAnchor="middle"
					fontFamily="Fraunces, serif"
					fontSize="22"
					fontWeight="900"
					fill="#8C1F2A"
				>
					CRUNCH
				</text>
				<text
					x="80"
					y="128"
					textAnchor="middle"
					fontFamily="Fraunces, serif"
					fontSize="22"
					fontWeight="900"
					fill="#8C1F2A"
				>
					BAR
				</text>
				{/* small illustration */}
				<rect x="50" y="146" width="60" height="40" rx="4" fill="#E8A22A" />
				<text
					x="80"
					y="172"
					textAnchor="middle"
					fontFamily="Inter, sans-serif"
					fontSize="7"
					fontWeight="700"
					fill="#8C1F2A"
				>
					HAZELNUT
				</text>
			</svg>
		</div>
	);
}

function HeroBowl({
	className,
	fill,
	accent,
	label,
}: {
	className?: string;
	fill: string;
	accent: string;
	label: string;
}) {
	return (
		<div
			className={`relative h-[140px] w-[180px] drop-shadow-[0_18px_18px_rgba(0,0,0,0.18)] sm:h-[170px] sm:w-[220px] lg:h-[220px] lg:w-[280px] ${className ?? ""}`}
		>
			<svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden="true">
				<title>{label} bowl</title>
				{/* bowl */}
				<ellipse cx="140" cy="160" rx="130" ry="30" fill="#E9D9C1" />
				<path d="M 10 160 Q 140 220 270 160 L 270 110 Q 140 60 10 110 Z" fill="#F4E7D0" />
				<ellipse cx="140" cy="110" rx="130" ry="30" fill="#FFFFFF" opacity="0.4" />
				{/* contents - clusters */}
				{Array.from({ length: 28 }).map((_, i) => {
					const cx = 30 + ((i * 41) % 220);
					const cy = 80 + ((i * 17) % 30);
					const r = 6 + ((i * 5) % 8);
					return (
						<circle key={`b-${i}`} cx={cx} cy={cy} r={r} fill={i % 3 === 0 ? accent : fill} opacity={0.95} />
					);
				})}
			</svg>
		</div>
	);
}
