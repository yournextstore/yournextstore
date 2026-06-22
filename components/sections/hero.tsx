import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-hero-rose">
			{/* Soft halo behind packets */}
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-gradient-to-b from-rose/40 via-rose/10 to-transparent"
			/>

			{/* SVG light leak */}
			<svg
				aria-hidden
				className="pointer-events-none absolute -right-24 top-10 z-0 hidden md:block opacity-30"
				width="520"
				height="520"
				viewBox="0 0 520 520"
				fill="none"
			>
				<defs>
					<radialGradient id="leak" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#F5E5C8" stopOpacity="0.9" />
						<stop offset="100%" stopColor="#E5B8A8" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle cx="260" cy="260" r="260" fill="url(#leak)" />
			</svg>

			<div className="relative">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20">
					<div className="grid lg:grid-cols-12 gap-10 items-center">
						{/* Left — packet 1 */}
						<div className="lg:col-span-5 order-2 lg:order-1">
							<PouchSVG flavor="spicy" />
						</div>

						{/* Center — copy & CTA */}
						<div className="lg:col-span-2 order-1 lg:order-2 text-center px-2">
							<p className="font-display text-[10px] tracking-[0.32em] uppercase text-chili">
								Tofu has never been more fun
							</p>
							<h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] text-charcoal">
								BIG
								<br />
								<span className="text-chili">FLAVOR</span>
								<br />
								SNACKS
							</h1>
							<p className="font-script mt-5 text-base text-mahogany">
								Meet your new favorite savory protein snack.
							</p>
						</div>

						{/* Right — packet 2 */}
						<div className="lg:col-span-5 order-3">
							<PouchSVG flavor="bbq" />
						</div>
					</div>

					{/* Bottom CTA strip */}
					<div className="mt-6 sm:mt-10 grid sm:grid-cols-[1fr_auto] items-end gap-6 sm:gap-10">
						<p className="font-script text-xl sm:text-2xl text-charcoal max-w-md">
							Meet your new favorite savory protein snack.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="group inline-flex items-center justify-between gap-3 rounded-full bg-chili px-8 py-4 font-display text-sm uppercase tracking-[0.18em] text-cream shadow-[0_8px_30px_rgba(217,67,39,0.35)] hover:bg-mahogany transition-all w-full sm:w-auto"
						>
							Shop Now
							<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</YnsLink>
					</div>
				</div>

				{/* Decorative pepper */}
				<svg
					aria-hidden
					className="absolute right-6 bottom-6 hidden lg:block opacity-80"
					width="80"
					height="80"
					viewBox="0 0 80 80"
				>
					<title>chili</title>
					<path
						d="M40 12 C50 18 56 28 56 42 c0 12-8 22-18 24 c-10 2-22-6-24-18 C12 36 22 26 30 26 c6 0 8-6 6-10 z"
						fill="#D94327"
					/>
					<path d="M36 8 c2-4 8-4 10 0 c-2 2-4 6-4 8 c-2-2-4-6-6-8z" fill="#2f6b1f" />
				</svg>
			</div>
		</section>
	);
}

function PouchSVG({ flavor }: { flavor: "spicy" | "bbq" }) {
	const isSpicy = flavor === "spicy";
	const accent = isSpicy ? "#D94327" : "#D94327";
	const footer = isSpicy ? "#E84A2C" : "#D94327";
	const label = isSpicy ? "SPICY CHILI" : "SOY BBQ";
	const sub = "Savory Protein Snack";
	const subBadge = isSpicy ? "Medium Spicy" : "0g Added Sugar";

	return (
		<div className="relative aspect-[3/4] w-full max-w-md mx-auto rotate-[-3deg] hover-wiggle">
			{/* Drop shadow */}
			<div className="absolute inset-0 rounded-3xl bg-charcoal/10 blur-2xl translate-y-6 scale-95" />

			<svg viewBox="0 0 320 420" className="relative h-full w-full" xmlns="http://www.w3.org/2000/svg">
				<title>{label}</title>
				<defs>
					<linearGradient id={`pouch-${flavor}`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#FBF1DD" />
						<stop offset="60%" stopColor="#F5E5C8" />
						<stop offset="100%" stopColor="#E8D4AC" />
					</linearGradient>
					<linearGradient id={`tofu-${flavor}`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#5a2818" />
						<stop offset="100%" stopColor="#2a0e08" />
					</linearGradient>
				</defs>

				{/* Pouch body with crinkled top */}
				<path
					d="M20 30 q20 -10 40 0 q20 10 40 0 q20 -10 40 0 q20 10 40 0 q20 -10 40 0 q20 10 40 0 q20 -10 40 0 L300 410 q-10 5 -20 0 q-10 -5 -20 0 q-10 5 -20 0 q-10 -5 -20 0 q-10 5 -20 0 q-10 -5 -20 0 q-10 5 -20 0 q-10 -5 -20 0 q-10 5 -20 0 q-10 -5 -20 0 q-10 5 -20 0 q-10 -5 -20 0 q-10 5 -20 0 Z"
					fill={`url(#pouch-${flavor})`}
					stroke="#7a2418"
					strokeOpacity="0.08"
					strokeWidth="0.5"
				/>

				{/* Tagline at top */}
				<text
					x="160"
					y="70"
					textAnchor="middle"
					fill={accent}
					fontFamily="var(--font-display), Arial Black, sans-serif"
					fontWeight="800"
					fontSize="11"
					letterSpacing="2"
				>
					TOFU HAS NEVER BEEN MORE FUN
				</text>

				{/* Big logo */}
				<text
					x="160"
					y="120"
					textAnchor="middle"
					fill={accent}
					fontFamily="var(--font-display), Arial Black, sans-serif"
					fontWeight="800"
					fontSize="38"
					letterSpacing="1"
				>
					YOUR NEXT
				</text>
				<text
					x="160"
					y="155"
					textAnchor="middle"
					fill={accent}
					fontFamily="var(--font-display), Arial Black, sans-serif"
					fontWeight="800"
					fontSize="38"
					letterSpacing="1"
				>
					STORE
				</text>

				{/* Badges */}
				<g>
					<circle cx="48" cy="195" r="22" fill={accent} />
					<text
						x="48"
						y="194"
						textAnchor="middle"
						fill="#F5E5C8"
						fontFamily="var(--font-display), Arial Black, sans-serif"
						fontWeight="800"
						fontSize="9"
					>
						12g
					</text>
					<text
						x="48"
						y="206"
						textAnchor="middle"
						fill="#F5E5C8"
						fontFamily="var(--font-sans), Inter, sans-serif"
						fontWeight="700"
						fontSize="6.5"
						letterSpacing="0.8"
					>
						PROTEIN
					</text>

					<circle cx="48" cy="247" r="22" fill={accent} />
					<text
						x="48"
						y="246"
						textAnchor="middle"
						fill="#F5E5C8"
						fontFamily="var(--font-display), Arial Black, sans-serif"
						fontWeight="800"
						fontSize="9"
					>
						0g
					</text>
					<text
						x="48"
						y="258"
						textAnchor="middle"
						fill="#F5E5C8"
						fontFamily="var(--font-sans), Inter, sans-serif"
						fontWeight="700"
						fontSize="5.6"
						letterSpacing="0.8"
					>
						{isSpicy ? "SUGAR" : "ADDED SUGAR"}
					</text>

					{isSpicy && (
						<>
							<circle cx="48" cy="143" r="22" fill={accent} />
							<text
								x="48"
								y="139"
								textAnchor="middle"
								fill="#F5E5C8"
								fontFamily="var(--font-sans), Inter, sans-serif"
								fontWeight="800"
								fontSize="5.8"
								letterSpacing="0.5"
							>
								MEDIUM
							</text>
							<text
								x="48"
								y="149"
								textAnchor="middle"
								fill="#F5E5C8"
								fontFamily="var(--font-sans), Inter, sans-serif"
								fontWeight="800"
								fontSize="5.8"
								letterSpacing="0.5"
							>
								SPICY
							</text>
						</>
					)}
				</g>

				{/* Tofu cubes window */}
				<g transform="translate(85,180)">
					<rect x="0" y="0" width="170" height="160" rx="10" fill={`url(#tofu-${flavor})`} />
					{/* Cube highlights */}
					<rect x="20" y="20" width="50" height="50" rx="4" fill="#caa07a" opacity="0.85" />
					<rect x="78" y="40" width="55" height="55" rx="4" fill="#b88a64" opacity="0.85" />
					<rect x="36" y="86" width="60" height="55" rx="4" fill="#caa07a" opacity="0.8" />
					{/* Glaze flecks */}
					<circle cx="30" cy="32" r="2" fill="#d94327" opacity="0.9" />
					<circle cx="56" cy="58" r="1.5" fill="#d94327" opacity="0.7" />
					<circle cx="100" cy="62" r="2" fill="#d94327" opacity="0.9" />
					<circle cx="120" cy="100" r="2.5" fill="#d94327" opacity="0.85" />
					<circle cx="60" cy="120" r="1.8" fill="#d94327" opacity="0.8" />
				</g>

				{/* Footer label */}
				<path d="M0 350 Q160 360 320 350 L320 420 L0 420 Z" fill={footer} />
				<text
					x="160"
					y="382"
					textAnchor="middle"
					fill="#F5E5C8"
					fontFamily="var(--font-display), Arial Black, sans-serif"
					fontWeight="800"
					fontSize="22"
					letterSpacing="1.5"
				>
					{label}
				</text>
				<text
					x="160"
					y="400"
					textAnchor="middle"
					fill="#F5E5C8"
					fontFamily="var(--font-sans), Inter, sans-serif"
					fontStyle="italic"
					fontSize="10"
				>
					{sub} · {subBadge}
				</text>
			</svg>
		</div>
	);
}
