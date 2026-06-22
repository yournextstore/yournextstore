import { YnsLink } from "../yns-link";

const stockists = [
	{ name: "Sunbreak Bar", city: "Brooklyn, NY", distance: "0.6 mi" },
	{ name: "Pool Club", city: "Miami Beach, FL", distance: "1.2 mi" },
	{ name: "Driftwood Bottle Shop", city: "Venice, CA", distance: "2.4 mi" },
	{ name: "Ortega Rooftop", city: "Austin, TX", distance: "3.0 mi" },
];

export function FindUs() {
	return (
		<section className="bg-fizz-aqua/40 py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-10 items-center">
					{/* Stylized map */}
					<div className="relative aspect-[5/4] rounded-[2.5rem] overflow-hidden bg-fizz-aqua sticker-shadow">
						<svg viewBox="0 0 600 480" className="absolute inset-0 w-full h-full">
							<defs>
								<linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
									<stop offset="0%" stopColor="#a8dde0" />
									<stop offset="100%" stopColor="#7dc4c9" />
								</linearGradient>
							</defs>
							<rect width="600" height="480" fill="url(#sea)" />
							{/* abstract islands */}
							<path
								d="M40 80 Q140 20 240 90 T420 100 T580 60 L580 180 Q420 160 280 200 T40 220 Z"
								fill="#fbef7c"
								opacity="0.85"
							/>
							<path d="M70 320 Q200 280 320 320 T560 340 L560 470 L70 470 Z" fill="#e6bdc2" opacity="0.85" />
							{/* roads */}
							<path
								d="M0 240 Q200 260 400 220 T600 250"
								stroke="#ffffff"
								strokeWidth="3"
								strokeDasharray="6 8"
								fill="none"
							/>
							<path
								d="M120 0 Q180 200 300 260 T540 480"
								stroke="#ffffff"
								strokeWidth="3"
								strokeDasharray="6 8"
								fill="none"
							/>
							{/* pins */}
							{[
								{ x: 180, y: 180 },
								{ x: 380, y: 140 },
								{ x: 260, y: 360 },
								{ x: 470, y: 320 },
							].map((p, i) => (
								<g key={`pin-${i}`} transform={`translate(${p.x}, ${p.y})`}>
									<circle r="14" fill="#b23c5e" />
									<circle r="5" fill="#fff9dc" />
								</g>
							))}
							<text
								x="40"
								y="50"
								fontFamily="Archivo Black, sans-serif"
								fontSize="26"
								fill="#1a1f3a"
								letterSpacing="2"
							>
								FIZZ MAP
							</text>
						</svg>
					</div>

					{/* Content */}
					<div>
						<p className="text-xs uppercase tracking-[0.35em] font-bold text-fizz-sky mb-3">Find Us</p>
						<h2 className="font-display uppercase text-fizz-ink text-3xl sm:text-5xl leading-[0.95] tracking-tight">
							In a fridge
							<br />
							near you.
						</h2>
						<p className="mt-5 text-base sm:text-lg text-fizz-ink/80 font-medium max-w-md">
							Tap in your postcode and we&apos;ll show you the closest spot pouring the good stuff.
						</p>

						<form className="mt-8 flex max-w-md gap-2 rounded-full bg-white p-1.5 sticker-shadow">
							<input
								type="text"
								name="postcode"
								placeholder="Enter postcode"
								className="flex-1 h-11 px-5 bg-transparent text-fizz-ink placeholder:text-fizz-ink/40 outline-none text-sm font-semibold"
							/>
							<button
								type="submit"
								className="h-11 px-6 rounded-full bg-fizz-yellow text-fizz-ink text-sm font-bold hover:bg-fizz-yellow/80 transition-colors"
							>
								Find
							</button>
						</form>

						<ul className="mt-8 divide-y divide-fizz-ink/10 max-w-md">
							{stockists.map((s) => (
								<li key={s.name} className="flex items-center justify-between py-3 text-sm">
									<div>
										<p className="font-bold text-fizz-ink">{s.name}</p>
										<p className="text-fizz-ink/60">{s.city}</p>
									</div>
									<span className="text-xs font-bold uppercase tracking-[0.18em] text-fizz-berry">
										{s.distance}
									</span>
								</li>
							))}
						</ul>

						<YnsLink
							href="/products"
							className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-fizz-sky hover:text-fizz-berry transition-colors"
						>
							See all stockists
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M5 12h14M13 5l7 7-7 7"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
