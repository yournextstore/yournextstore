import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-pool-ripple text-white isolate">
			{/* Caustic light rays SVG overlay */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 w-full h-full mix-blend-screen opacity-60 pointer-events-none"
				viewBox="0 0 1200 600"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
					</linearGradient>
				</defs>
				{Array.from({ length: 9 }).map((_, i) => (
					<polygon
						key={`ray-${i}`}
						fill="url(#ray)"
						points={`${-200 + i * 160},0 ${-100 + i * 160},0 ${300 + i * 160},600 ${100 + i * 160},600`}
					/>
				))}
			</svg>

			{/* Soft white highlight */}
			<div
				aria-hidden="true"
				className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-64 rounded-full bg-white/40 blur-3xl"
			/>

			{/* Two pastel can shapes (decorative SVG) */}
			<div
				aria-hidden="true"
				className="absolute right-[-3%] top-1/2 -translate-y-1/2 w-[55%] max-w-[720px] hidden sm:block"
			>
				<svg viewBox="0 0 600 600" className="w-full h-auto drop-shadow-2xl animate-float-y">
					<defs>
						<linearGradient id="canA" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stopColor="#f4d6da" />
							<stop offset="55%" stopColor="#e6bdc2" />
							<stop offset="100%" stopColor="#c89aa1" />
						</linearGradient>
						<linearGradient id="canB" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stopColor="#fbe7eb" />
							<stop offset="55%" stopColor="#e6bdc2" />
							<stop offset="100%" stopColor="#b88f97" />
						</linearGradient>
					</defs>
					{/* back can */}
					<g transform="rotate(-22 300 300)">
						<rect x="170" y="60" width="170" height="480" rx="22" fill="url(#canA)" />
						<rect x="170" y="60" width="170" height="36" rx="14" fill="#d4d4d8" />
						<rect x="178" y="68" width="154" height="22" rx="10" fill="#a1a1aa" />
						<text
							x="255"
							y="320"
							textAnchor="middle"
							fontFamily="Archivo Black, sans-serif"
							fontSize="78"
							fill="#b23c5e"
							letterSpacing="2"
						>
							YNS
						</text>
						<text
							x="255"
							y="370"
							textAnchor="middle"
							fontFamily="Inter, sans-serif"
							fontSize="14"
							fontWeight="700"
							fill="#b23c5e"
							letterSpacing="3"
						>
							SPARKLING WATER
						</text>
					</g>
					{/* front can */}
					<g transform="rotate(18 360 320)">
						<rect x="330" y="80" width="180" height="500" rx="24" fill="url(#canB)" />
						<rect x="330" y="80" width="180" height="38" rx="14" fill="#e4e4e7" />
						<rect x="338" y="88" width="164" height="24" rx="10" fill="#a1a1aa" />
						<text
							x="420"
							y="340"
							textAnchor="middle"
							fontFamily="Archivo Black, sans-serif"
							fontSize="84"
							fill="#b23c5e"
							letterSpacing="2"
						>
							YNS
						</text>
						<text
							x="420"
							y="390"
							textAnchor="middle"
							fontFamily="Inter, sans-serif"
							fontSize="14"
							fontWeight="700"
							fill="#b23c5e"
							letterSpacing="3"
						>
							APPLE · BLACKCURRANT
						</text>
					</g>
				</svg>
			</div>

			{/* Content */}
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-24 sm:py-32 lg:py-40 max-w-2xl">
					<p className="text-xs sm:text-sm uppercase tracking-[0.4em] font-bold text-fizz-yellow drop-shadow-sm mb-4">
						Sparkling · Still · Made for Now
					</p>
					<h1 className="font-display text-fizz-yellow leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] uppercase drop-shadow-[0_2px_0_rgba(0,0,0,0.08)]">
						Welcome to the
						<br />
						Fizz Free Era
					</h1>
					<p className="mt-6 max-w-md text-base sm:text-lg text-white font-semibold drop-shadow-sm">
						Five-times distilled spirits, purified still water, and natural fruit — that&apos;s it. Crisp,
						clean, never sugary.
					</p>
					<div className="mt-10 flex flex-wrap gap-3">
						<YnsLink
							prefetch={"eager"}
							href="#flavors"
							className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-fizz-aqua text-fizz-ink rounded-full text-sm font-bold hover:bg-white transition-colors sticker-shadow"
						>
							Find Near You
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-fizz-sky text-white rounded-full text-sm font-bold hover:bg-fizz-sky/90 transition-colors sticker-shadow"
						>
							Shop now
						</YnsLink>
					</div>
				</div>
			</div>

			{/* Bottom water-line gradient */}
			<div
				aria-hidden="true"
				className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-fizz-aqua-deep/40"
			/>
		</section>
	);
}
