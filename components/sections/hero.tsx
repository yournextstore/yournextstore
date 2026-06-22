import { YnsLink } from "../yns-link";

function Heart({ className, style }: { className?: string; style?: React.CSSProperties }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
			<path d="M12 21s-7.5-4.5-9.5-9.2C1.2 8.6 3 5 6.4 5c2 0 3.5 1 4.6 2.5C12.1 6 13.6 5 15.6 5 19 5 20.8 8.6 19.5 11.8 17.5 16.5 12 21 12 21z" />
		</svg>
	);
}

function PeacockBird() {
	// Whimsical illustrated peacock-style bird holding a heart gift
	return (
		<svg viewBox="0 0 220 280" className="w-44 sm:w-56 lg:w-72 drop-shadow-xl" aria-hidden="true">
			<title>Whimsical bakery bird mascot</title>
			{/* Tail plumes */}
			<g fill="none" stroke="#3a1418" strokeWidth="2.5" strokeLinecap="round">
				<path d="M70 175 C 30 165, 15 140, 35 110" />
				<path d="M70 185 C 25 185, 10 165, 25 140" />
				<path d="M70 195 C 25 205, 15 190, 30 165" />
				<path d="M75 200 C 35 230, 25 215, 45 195" />
			</g>
			{/* Plume tips (heart eyes) */}
			<g fill="#f4a3b0" stroke="#3a1418" strokeWidth="2">
				<circle cx="35" cy="110" r="10" />
				<circle cx="25" cy="140" r="10" />
				<circle cx="30" cy="165" r="10" />
				<circle cx="45" cy="195" r="10" />
			</g>
			<g fill="#3a1418">
				<circle cx="35" cy="110" r="3" />
				<circle cx="25" cy="140" r="3" />
				<circle cx="30" cy="165" r="3" />
				<circle cx="45" cy="195" r="3" />
			</g>

			{/* Body */}
			<path
				d="M70 130 C 70 90, 110 75, 140 100 C 165 120, 165 175, 140 200 C 115 225, 75 215, 70 180 Z"
				fill="#5c1b26"
			/>

			{/* Belly */}
			<path d="M95 150 C 100 130, 130 130, 140 160 C 138 185, 110 195, 95 175 Z" fill="#7a2230" />

			{/* Head crest */}
			<g stroke="#3a1418" strokeWidth="2.5" strokeLinecap="round" fill="none">
				<path d="M148 78 C 150 65, 145 55, 155 50" />
				<path d="M152 82 C 158 70, 168 65, 172 55" />
				<path d="M156 88 C 168 80, 178 78, 180 68" />
			</g>
			<g fill="#f4a3b0">
				<circle cx="155" cy="50" r="4" />
				<circle cx="172" cy="55" r="4" />
				<circle cx="180" cy="68" r="4" />
			</g>

			{/* Head */}
			<circle cx="155" cy="100" r="22" fill="#5c1b26" />
			{/* Eye */}
			<circle cx="166" cy="96" r="4" fill="#fdf6ef" />
			<circle cx="167" cy="97" r="2.2" fill="#3a1418" />
			{/* Beak */}
			<path d="M177 102 L 192 100 L 177 110 Z" fill="#f4a3b0" stroke="#3a1418" strokeWidth="1.5" />

			{/* Heart in arms */}
			<g transform="translate(78,130)">
				<path
					d="M30 8 C 35 -2, 55 -2, 55 14 C 55 28, 30 44, 30 44 C 30 44, 5 28, 5 14 C 5 -2, 25 -2, 30 8 Z"
					fill="#f4a3b0"
					stroke="#3a1418"
					strokeWidth="2.5"
				/>
				<path d="M5 14 L55 14" stroke="#d9261c" strokeWidth="4" strokeLinecap="round" />
				<circle cx="30" cy="14" r="6" fill="#d9261c" />
				<path
					d="M28 8 L 28 -4 M 32 8 L 32 -4 M 28 -4 C 24 -8, 24 -2, 30 -2 C 36 -2, 36 -8, 32 -4"
					stroke="#d9261c"
					strokeWidth="2.5"
					fill="none"
				/>
			</g>

			{/* Legs */}
			<g stroke="#3a1418" strokeWidth="3" strokeLinecap="round" fill="none">
				<path d="M100 225 L 100 255" />
				<path d="M125 225 L 125 255" />
				<path d="M92 257 L 108 257 M 100 257 L 100 263" />
				<path d="M117 257 L 133 257 M 125 257 L 125 263" />
			</g>
		</svg>
	);
}

function CookieStack() {
	return (
		<svg viewBox="0 0 320 320" className="w-64 sm:w-80 lg:w-[28rem] drop-shadow-2xl" aria-hidden="true">
			<title>Stack of chocolate chip cookies with gift box</title>
			<defs>
				<radialGradient id="cookieGrad" cx="0.4" cy="0.3" r="0.8">
					<stop offset="0%" stopColor="#f4cf8a" />
					<stop offset="60%" stopColor="#d49a4a" />
					<stop offset="100%" stopColor="#8a5a2a" />
				</radialGradient>
				<radialGradient id="cookieGrad2" cx="0.5" cy="0.3" r="0.7">
					<stop offset="0%" stopColor="#f0c581" />
					<stop offset="100%" stopColor="#a4682b" />
				</radialGradient>
			</defs>

			{/* Gift box (pink with ribbon) — behind stack */}
			<g transform="translate(20,170)">
				<rect x="0" y="20" width="100" height="80" rx="3" fill="#e76b80" />
				<rect x="0" y="20" width="100" height="14" fill="#c14a60" />
				<rect x="45" y="20" width="10" height="80" fill="#f4a3b0" />
				{/* Ribbon bow */}
				<path
					d="M30 20 C 30 0, 50 0, 50 20 M 70 20 C 70 0, 50 0, 50 20"
					fill="#f4a3b0"
					stroke="#c14a60"
					strokeWidth="1.5"
				/>
				<circle cx="50" cy="20" r="6" fill="#c14a60" />
			</g>

			{/* Cookie stack */}
			{[0, 1, 2, 3, 4].map((i) => {
				const y = 240 - i * 32;
				return (
					<g key={`c-${i}`} transform={`translate(110, ${y})`}>
						<ellipse cx="80" cy="20" rx="80" ry="22" fill="url(#cookieGrad)" />
						<ellipse cx="80" cy="14" rx="80" ry="20" fill="url(#cookieGrad2)" />
						{/* Chips */}
						{[
							[25, 10],
							[55, 4],
							[95, 8],
							[130, 12],
							[40, 18],
							[75, 20],
							[110, 16],
							[145, 6],
						].map(([cx, cy], idx) => (
							<ellipse key={`chip-${i}-${idx}`} cx={cx} cy={cy} rx="6" ry="4" fill="#2a0e0a" />
						))}
					</g>
				);
			})}
		</svg>
	);
}

export function Hero() {
	const heartPositions = [32, 58, 41, 67, 36, 62, 48, 55, 38, 71, 44, 60];
	const hearts = heartPositions.map((left, i) => ({
		left,
		delay: (i % 6) * 0.7,
		size: 14 + (i % 4) * 6,
		duration: 5 + (i % 5),
	}));

	return (
		<section className="relative overflow-hidden hero-candy">
			{/* Decorative diagonal stripes — subtle */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.05] pointer-events-none"
				style={{
					backgroundImage: "repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 16px)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative pt-14 sm:pt-20 lg:pt-24 pb-44 sm:pb-56 lg:pb-72">
					{/* Headline */}
					<h1 className="relative z-10 text-center font-display italic text-white text-[42px] sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">
						Cookies Worth Falling For
					</h1>

					<p className="relative z-10 mt-5 text-center text-white/95 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
						Small-batch, hand-baked, and packed with love. Send a gift, treat yourself, or stock the pantry —
						every box ships with a hand-written note.
					</p>

					<div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-3 justify-center">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-8 bg-white text-[var(--candy)] rounded-full text-sm font-bold tracking-[0.18em] uppercase hover:bg-[var(--cream)] transition-colors shadow-lg"
						>
							Shop Cookies
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#gifts"
							className="inline-flex items-center justify-center h-12 px-8 border-2 border-white text-white rounded-full text-sm font-bold tracking-[0.18em] uppercase hover:bg-white hover:text-[var(--candy)] transition-colors"
						>
							Send a Gift
						</YnsLink>
					</div>

					{/* Confetti hearts */}
					<div aria-hidden="true" className="absolute inset-0 pointer-events-none">
						{hearts.map((h, i) => (
							<Heart
								key={`h-${i}`}
								className="absolute text-[var(--blush)] animate-float-heart"
								style={{
									left: `${h.left}%`,
									bottom: "30%",
									width: `${h.size}px`,
									height: `${h.size}px`,
									animationDelay: `${h.delay}s`,
									animationDuration: `${h.duration}s`,
									color: i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#f4a3b0" : "#7a1f28",
									opacity: 0.85,
								}}
							/>
						))}
					</div>

					{/* Bird (left) */}
					<div className="absolute bottom-10 left-2 sm:left-6 lg:left-12 z-10 hidden sm:block">
						<PeacockBird />
					</div>

					{/* Cookie stack (right) */}
					<div className="absolute bottom-6 right-2 sm:right-6 lg:right-12 z-10">
						<CookieStack />
					</div>

					{/* Plush hearts cluster (far right) */}
					<div className="absolute bottom-6 right-0 z-0 hidden lg:flex flex-col gap-1 items-end">
						<Heart className="text-[#c43a3a] w-16 h-16" />
						<Heart className="text-[#e84a4a] w-20 h-20 -mt-6" />
					</div>
				</div>
			</div>

			{/* Cream ground curve */}
			<div
				aria-hidden="true"
				className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 lg:h-48"
				style={{
					backgroundImage: "radial-gradient(150% 100% at 50% 100%, #fdf6ef 0%, #fdf6ef 60%, transparent 61%)",
				}}
			/>
		</section>
	);
}
