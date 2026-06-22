import { YnsLink } from "../yns-link";

function CourtPanel() {
	return (
		<div className="relative h-full w-full overflow-hidden bg-court film-grain">
			<svg
				viewBox="0 0 400 600"
				preserveAspectRatio="xMidYMid slice"
				className="absolute inset-0 h-full w-full"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="court-sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#1f1410" />
						<stop offset="55%" stopColor="#3a1b14" />
						<stop offset="100%" stopColor="#0e0e10" />
					</linearGradient>
					<linearGradient id="court-floor" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#3d6b3a" stopOpacity="0.95" />
						<stop offset="100%" stopColor="#173317" stopOpacity="1" />
					</linearGradient>
				</defs>
				<rect width="400" height="600" fill="url(#court-sky)" />
				<polygon points="0,420 400,360 400,600 0,600" fill="url(#court-floor)" />
				{Array.from({ length: 14 }).map((_, i) => (
					<line
						key={`hline-${i}`}
						x1={-100 + i * 50}
						y1={600}
						x2={120 + i * 30}
						y2={420}
						stroke="#ffffff"
						strokeOpacity="0.08"
						strokeWidth="1"
					/>
				))}
				<line x1="0" y1="448" x2="400" y2="408" stroke="#fff" strokeOpacity="0.18" strokeWidth="2" />
				<line x1="0" y1="520" x2="400" y2="478" stroke="#fff" strokeOpacity="0.1" strokeWidth="1.5" />
				{/* Chain link fence */}
				<g opacity="0.18" stroke="#ffffff" strokeWidth="0.8">
					{Array.from({ length: 28 }).map((_, i) => (
						<line key={`f1-${i}`} x1={i * 18} y1={0} x2={i * 18 + 20} y2={420} />
					))}
					{Array.from({ length: 28 }).map((_, i) => (
						<line key={`f2-${i}`} x1={i * 18 + 20} y1={0} x2={i * 18} y2={420} />
					))}
				</g>
				{/* Athlete silhouette serve pose */}
				<g transform="translate(120 90)" fill="#7d1e1a">
					<ellipse cx="60" cy="38" rx="14" ry="16" fill="#2a1a14" />
					<rect x="44" y="55" width="36" height="62" rx="8" fill="#ffffff" opacity="0.92" />
					<path d="M48 115 L34 200 L52 290 L70 290 L72 200 L80 115 Z" fill="#8c2a24" />
					<path d="M58 55 Q30 30 18 -10 L26 -14 Q40 25 60 50 Z" fill="#2a1a14" />
					<rect x="14" y="-44" width="10" height="40" rx="3" fill="#d9c89a" />
					<circle cx="18" cy="-50" r="14" fill="#e9e3d1" stroke="#0e0e10" strokeWidth="1" />
				</g>
				{/* warm light beam */}
				<polygon points="240,0 400,0 400,260 200,260" fill="#f4c378" opacity="0.18" />
			</svg>
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
		</div>
	);
}

function MonoPanel() {
	return (
		<div className="relative h-full w-full overflow-hidden bg-mono film-grain">
			<svg
				viewBox="0 0 400 600"
				preserveAspectRatio="xMidYMid slice"
				className="absolute inset-0 h-full w-full"
				aria-hidden="true"
			>
				<defs>
					<radialGradient id="mono-spot" cx="35%" cy="35%" r="65%">
						<stop offset="0%" stopColor="#3a3a3c" />
						<stop offset="70%" stopColor="#0e0e10" />
						<stop offset="100%" stopColor="#000" />
					</radialGradient>
				</defs>
				<rect width="400" height="600" fill="url(#mono-spot)" />
				{/* Crouched lunge silhouette */}
				<g transform="translate(60 80)" fill="#dad6cf">
					<ellipse cx="160" cy="60" rx="20" ry="22" />
					<path d="M140 90 Q120 130 140 170 L210 175 Q235 130 220 90 Z" fill="#b5b0a7" />
					<path d="M150 175 L120 280 L80 310 L70 340 L130 320 L170 240 Z" fill="#8c2a24" />
					<path d="M210 175 L260 250 L320 310 L320 340 L260 320 L210 250 Z" fill="#9a9087" />
					<path d="M140 100 L80 130 L70 145 L130 130 Z" fill="#b5b0a7" />
				</g>
				{/* hard side light streak */}
				<polygon points="0,0 140,0 280,600 0,600" fill="#ffffff" opacity="0.04" />
			</svg>
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
		</div>
	);
}

function CoastalPanel() {
	return (
		<div className="relative h-full w-full overflow-hidden bg-coastal film-grain">
			<svg
				viewBox="0 0 400 600"
				preserveAspectRatio="xMidYMid slice"
				className="absolute inset-0 h-full w-full"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="coast-sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#d9cdb8" />
						<stop offset="55%" stopColor="#9b8e7a" />
						<stop offset="100%" stopColor="#3c3631" />
					</linearGradient>
				</defs>
				<rect width="400" height="600" fill="url(#coast-sky)" />
				<path d="M0,440 Q100,420 200,440 T400,440 L400,600 L0,600 Z" fill="#2c2c2e" />
				{/* sun haze */}
				<circle cx="290" cy="180" r="80" fill="#f6e7c5" opacity="0.5" />
				<circle cx="290" cy="180" r="40" fill="#fff3d6" opacity="0.65" />
				{/* Runner silhouette */}
				<g transform="translate(120 250)" fill="#e9e0cd">
					<ellipse cx="40" cy="30" rx="10" ry="12" />
					<rect x="30" y="42" width="22" height="40" rx="6" />
					<path d="M30 80 L18 130 L12 175 L28 175 L36 130 L48 90 Z" />
					<path d="M48 80 L66 120 L80 165 L66 170 L52 130 L42 90 Z" />
					<rect x="28" y="50" width="22" height="6" fill="#8c2a24" />
				</g>
				{/* coastal grass tufts */}
				<g stroke="#bba884" strokeWidth="1" fill="none" opacity="0.6">
					{Array.from({ length: 22 }).map((_, i) => (
						<path key={i} d={`M${10 + i * 18} 560 q-3 -20 0 -38 q3 18 0 38`} />
					))}
				</g>
			</svg>
			<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-[--ink]">
			<div className="relative grid grid-cols-3 h-[78vh] min-h-[560px] max-h-[760px]">
				<CourtPanel />
				<MonoPanel />
				<CoastalPanel />
			</div>

			{/* Centered text overlay */}
			<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
				<div className="pointer-events-auto max-w-3xl">
					<h1 className="display-hero text-white text-6xl sm:text-7xl md:text-8xl lg:text-[120px] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
						Strong To The Kore
					</h1>
					<p className="mt-6 text-white/90 text-base sm:text-lg max-w-xl mx-auto drop-shadow">
						New fitness essentials just landed, led by The YNS HardKore Short — our most technical performance
						short ever.
					</p>
					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
						<YnsLink
							prefetch={"eager"}
							href="/products?gender=men"
							className="inline-flex items-center justify-center h-12 px-8 bg-white text-[--ink] text-xs tracking-[0.18em] uppercase font-semibold hover:bg-[--bone] transition-colors"
						>
							Shop Men&apos;s New Arrivals
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/products?gender=women"
							className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-white border border-white/80 text-xs tracking-[0.18em] uppercase font-semibold hover:bg-white hover:text-[--ink] transition-colors"
						>
							Shop Women&apos;s New Arrivals
						</YnsLink>
					</div>
				</div>
			</div>

			{/* Athlete attribution bottom-left */}
			<div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-8 text-white text-xs sm:text-sm tracking-[0.12em] uppercase pointer-events-none">
				<span className="font-semibold">Jack Draper</span>
				<span className="opacity-60"> &nbsp;|&nbsp; Professional Tennis Player</span>
			</div>
		</section>
	);
}
