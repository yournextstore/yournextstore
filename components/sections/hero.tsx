import { YnsLink } from "../yns-link";

function BotanicalScene() {
	return (
		<svg
			viewBox="0 0 900 360"
			xmlns="http://www.w3.org/2000/svg"
			className="w-full h-auto max-w-3xl mx-auto drop-shadow-[0_30px_40px_rgba(74,58,34,0.08)]"
			aria-hidden="true"
		>
			<title>Botanical still life</title>
			<defs>
				<radialGradient id="orangeBody" cx="40%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFC07B" />
					<stop offset="60%" stopColor="#F19542" />
					<stop offset="100%" stopColor="#D26E1F" />
				</radialGradient>
				<radialGradient id="grapefruit" cx="50%" cy="50%" r="55%">
					<stop offset="0%" stopColor="#FFD9C4" />
					<stop offset="55%" stopColor="#F2A78E" />
					<stop offset="100%" stopColor="#D8765C" />
				</radialGradient>
				<radialGradient id="papayaFlesh" cx="35%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#FFB061" />
					<stop offset="100%" stopColor="#E07A2B" />
				</radialGradient>
				<radialGradient id="papayaSkin" cx="50%" cy="50%" r="55%">
					<stop offset="0%" stopColor="#E5C173" />
					<stop offset="100%" stopColor="#A4842F" />
				</radialGradient>
				<radialGradient id="lemonBody" cx="45%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE89F" />
					<stop offset="100%" stopColor="#E0AC3E" />
				</radialGradient>
				<linearGradient id="leafA" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#9CBE89" />
					<stop offset="100%" stopColor="#5E7C4E" />
				</linearGradient>
				<linearGradient id="leafB" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#B4D29D" />
					<stop offset="100%" stopColor="#769561" />
				</linearGradient>
				<radialGradient id="currant" cx="40%" cy="35%" r="65%">
					<stop offset="0%" stopColor="#F45D5B" />
					<stop offset="100%" stopColor="#9A1E20" />
				</radialGradient>
				<radialGradient id="blossom" cx="50%" cy="50%" r="55%">
					<stop offset="0%" stopColor="#FFFAF4" />
					<stop offset="100%" stopColor="#FFD9DA" />
				</radialGradient>
			</defs>

			{/* Grapefruit half (left back) */}
			<g transform="translate(220 145)">
				<circle r="90" fill="url(#grapefruit)" />
				<circle r="78" fill="#FFE1D2" opacity="0.7" />
				{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
					<path
						key={angle}
						d="M0 0 L65 -8 A78 78 0 0 1 65 8 Z"
						transform={`rotate(${angle})`}
						fill="#F2A78E"
						opacity="0.6"
					/>
				))}
				<circle r="10" fill="#F19173" />
				<circle r="85" fill="none" stroke="#C57B5E" strokeWidth="3" />
			</g>

			{/* Orange (front left) */}
			<g transform="translate(150 220)">
				<circle r="78" fill="url(#orangeBody)" />
				<ellipse cx="-20" cy="-25" rx="20" ry="14" fill="#FFD7A1" opacity="0.55" />
				<path d="M-8 -78 Q-2 -90 18 -94 Q40 -88 35 -72 Q22 -70 8 -72 Z" fill="url(#leafA)" />
				<path d="M-6 -76 Q10 -82 28 -78" stroke="#3F5A35" strokeWidth="1.2" fill="none" />
			</g>

			{/* Big basil leaves (center) */}
			<g transform="translate(450 175)">
				<path
					d="M-160 30 C-180 -40 -120 -130 -20 -150 C90 -160 180 -90 170 0 C160 70 60 110 -20 100 C-90 95 -150 75 -160 30 Z"
					fill="url(#leafB)"
				/>
				<path
					d="M-150 20 C-130 -30 -60 -110 30 -130 C100 -135 150 -85 145 -10"
					stroke="#3F5A35"
					strokeWidth="1.4"
					fill="none"
					opacity="0.4"
				/>
				<path
					d="M-140 25 C-100 5 -40 -45 30 -70 M-110 35 C-80 25 -30 -10 50 -30 M-70 45 C-40 30 10 0 80 0"
					stroke="#3F5A35"
					strokeWidth="0.8"
					fill="none"
					opacity="0.35"
				/>
				<path d="M-30 -110 C-60 -180 -160 -170 -200 -110 C-220 -60 -150 -10 -110 -40" fill="url(#leafA)" />
				<path d="M40 -120 C20 -180 90 -200 150 -160 C180 -120 130 -70 100 -90" fill="url(#leafB)" />

				{/* Tiny blossoms */}
				{[
					{ cx: -90, cy: -130 },
					{ cx: 60, cy: -140 },
					{ cx: -200, cy: -90 },
				].map((b) => (
					<g key={`${b.cx}-${b.cy}`} transform={`translate(${b.cx} ${b.cy})`}>
						{[0, 72, 144, 216, 288].map((a) => (
							<ellipse key={a} cx="0" cy="-8" rx="6" ry="9" transform={`rotate(${a})`} fill="url(#blossom)" />
						))}
						<circle r="3.5" fill="#F2B95C" />
					</g>
				))}
			</g>

			{/* Papaya half (right back) */}
			<g transform="translate(620 165)">
				<path
					d="M-115 25 C-130 -45 -50 -100 30 -95 C115 -85 140 -10 120 50 C100 95 30 110 -40 100 C-90 90 -110 70 -115 25 Z"
					fill="url(#papayaSkin)"
				/>
				<path
					d="M-95 25 C-105 -30 -45 -75 25 -75 C90 -70 115 -10 100 40 C85 80 25 90 -30 80 C-75 75 -90 60 -95 25 Z"
					fill="url(#papayaFlesh)"
				/>
				{[
					[-30, 10],
					[0, -10],
					[25, 15],
					[55, -5],
					[75, 25],
					[-50, 30],
					[10, 35],
					[40, 35],
					[-15, 45],
					[35, -30],
					[60, 50],
					[-40, -10],
					[20, -40],
				].map((p) => (
					<ellipse key={`${p[0]}-${p[1]}`} cx={p[0]} cy={p[1]} rx="6" ry="7" fill="#3a2a1a" />
				))}
			</g>

			{/* Lemon (back right) */}
			<g transform="translate(750 195)">
				<ellipse rx="75" ry="60" fill="url(#lemonBody)" transform="rotate(-12)" />
				<path d="M-50 -45 Q-30 -75 -10 -85 Q-5 -75 -25 -50 Z" fill="url(#leafA)" />
				<ellipse cx="-12" cy="-15" rx="22" ry="10" fill="#FFEEB4" opacity="0.55" />
			</g>

			{/* Currants (front right) */}
			<g transform="translate(820 270)">
				<path d="M0 -60 C5 -40 10 -20 0 0" stroke="#5e4a26" strokeWidth="1.5" fill="none" />
				{[
					{ x: -5, y: -5, r: 12 },
					{ x: 12, y: 4, r: 13 },
					{ x: -16, y: 8, r: 12 },
					{ x: 3, y: 18, r: 14 },
					{ x: 22, y: 22, r: 12 },
					{ x: -22, y: 24, r: 12 },
					{ x: -3, y: 36, r: 13 },
					{ x: 16, y: 40, r: 12 },
					{ x: -14, y: 42, r: 11 },
					{ x: 0, y: 54, r: 11 },
				].map((c) => (
					<g key={`${c.x}-${c.y}`}>
						<circle cx={c.x} cy={c.y} r={c.r} fill="url(#currant)" />
						<ellipse
							cx={c.x - c.r / 4}
							cy={c.y - c.r / 4}
							rx={c.r / 4}
							ry={c.r / 5}
							fill="#FFC8B0"
							opacity="0.7"
						/>
					</g>
				))}
			</g>

			{/* Subtle shadow under arrangement */}
			<ellipse cx="460" cy="335" rx="360" ry="14" fill="#4a3a22" opacity="0.08" />
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-cream-gradient">
			<div className="absolute inset-0 -z-10 opacity-40">
				<div className="absolute -top-10 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sage/30 blur-3xl" />
				<div className="absolute bottom-0 right-0 h-[360px] w-[360px] translate-x-1/3 rounded-full bg-peach/40 blur-3xl" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-0">
				<div className="relative">
					<BotanicalScene />
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
				<div className="border-t border-cocoa/15 pt-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
						<div className="lg:col-span-6">
							<h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.05] text-cocoa">
								Naturally crafted essentials for everyday rituals
							</h1>
						</div>
						<div className="lg:col-span-4 flex items-start">
							<p className="text-base text-cocoa/75 leading-relaxed max-w-sm">
								Promote a healthier balance in your daily ecology — botanical formulations made with prebiotic
								nutrients, vitamins, and slow-living intention.
							</p>
						</div>
						<div className="lg:col-span-2 flex lg:justify-end">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-12 px-7 bg-sage text-cocoa rounded-full text-[15px] font-medium hover:bg-sage/80 ring-1 ring-cocoa/10 hover:ring-cocoa/20 transition-all whitespace-nowrap"
							>
								Shop Your Next Store
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
