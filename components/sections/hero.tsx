import { ArrowRightIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-sky-scene">
			{/* Soft clouds */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 12% 30%, #ffffffaa 0 60px, transparent 80px), radial-gradient(circle at 78% 22%, #ffffffaa 0 50px, transparent 70px), radial-gradient(circle at 40% 78%, #ffffff88 0 70px, transparent 90px)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-14 sm:py-20 lg:py-24">
					{/* Left: copy */}
					<div className="relative z-10">
						<span className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold tracking-[0.25em] mb-6">
							<span className="h-1.5 w-1.5 rounded-full bg-[--color-sun-pop]" />
							NEW DROP
						</span>
						<h1 className="font-display font-extrabold text-foreground text-5xl sm:text-7xl lg:text-[88px] leading-[0.92] tracking-tight uppercase">
							Feel
							<br />
							Good
							<br />
							<span className="relative inline-block">
								<span className="relative z-10">Fuel</span>
								<span
									aria-hidden="true"
									className="absolute -inset-x-2 bottom-2 h-3 sm:h-4 bg-[--color-sun-pop] -z-0 -skew-x-6"
								/>
							</span>
						</h1>
						<p className="mt-6 max-w-md text-base sm:text-lg text-foreground/80 leading-relaxed">
							Clean energy straight from nature (hello, honey!). 1-2 pouches help support steady energy
							through a 60-minute game or active play.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[--color-sun-pop] text-foreground border-2 border-foreground font-display font-extrabold tracking-wide uppercase text-sm pill-shadow hover:translate-y-[-2px] transition-transform"
							>
								Explore
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-foreground border-2 border-foreground font-display font-extrabold tracking-wide uppercase text-sm hover:bg-foreground hover:text-white transition-colors"
							>
								Our Story
							</YnsLink>
						</div>

						{/* Carousel dots */}
						<div className="mt-12 flex items-center gap-3">
							<button
								type="button"
								aria-label="Previous"
								className="h-9 w-9 rounded-full bg-white border-2 border-foreground flex items-center justify-center hover:bg-[--color-sun-pop] transition-colors"
							>
								<ChevronLeft className="h-4 w-4" />
							</button>
							<div className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-foreground/30" />
								<span className="h-2 w-6 rounded-full bg-foreground" />
								<span className="h-2 w-2 rounded-full bg-foreground/30" />
							</div>
							<button
								type="button"
								aria-label="Next"
								className="h-9 w-9 rounded-full bg-white border-2 border-foreground flex items-center justify-center hover:bg-[--color-sun-pop] transition-colors"
							>
								<ChevronRight className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Right: hero product imagery */}
					<div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[480px]">
						{/* Award seal */}
						<div className="absolute -bottom-2 right-6 z-20 wiggle">
							<div className="relative h-24 w-24 sm:h-28 sm:w-28">
								<svg viewBox="0 0 100 100" className="h-full w-full">
									<title>Award Seal</title>
									<defs>
										<path id="circlePath" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
									</defs>
									<circle cx="50" cy="50" r="42" fill="#F9D34A" stroke="#131316" strokeWidth="3" />
									<circle
										cx="50"
										cy="50"
										r="32"
										fill="none"
										stroke="#131316"
										strokeWidth="1.5"
										strokeDasharray="2 3"
									/>
									<text fontSize="9" fontWeight="800" fontFamily="var(--font-display)" fill="#131316">
										<textPath href="#circlePath" startOffset="0">
											BRAND OF THE YEAR · 2026 · BRAND OF THE YEAR · 2026 ·
										</textPath>
									</text>
									<text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="900" fill="#131316">
										YNS
									</text>
									<text x="50" y="62" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#131316">
										AWARD
									</text>
								</svg>
							</div>
						</div>

						{/* Watermelon slices */}
						<svg
							aria-hidden="true"
							viewBox="0 0 120 120"
							className="absolute top-4 left-2 h-20 w-20 wiggle"
							style={{ animationDelay: "0.3s" }}
						>
							<circle cx="60" cy="60" r="56" fill="#E91E63" stroke="#131316" strokeWidth="3" />
							<circle cx="60" cy="60" r="42" fill="#ffd6e4" />
							<g fill="#131316">
								<ellipse cx="50" cy="50" rx="2.5" ry="4" />
								<ellipse cx="68" cy="48" rx="2.5" ry="4" />
								<ellipse cx="60" cy="65" rx="2.5" ry="4" />
								<ellipse cx="50" cy="75" rx="2.5" ry="4" />
								<ellipse cx="72" cy="72" rx="2.5" ry="4" />
							</g>
							<path d="M 4 60 A 56 56 0 0 1 116 60" fill="none" stroke="#7CB342" strokeWidth="6" />
						</svg>
						<svg
							aria-hidden="true"
							viewBox="0 0 120 120"
							className="absolute bottom-10 -left-2 h-24 w-24 wiggle"
							style={{ animationDelay: "0.8s" }}
						>
							<path d="M 10 110 A 60 60 0 0 1 110 110 Z" fill="#E91E63" stroke="#131316" strokeWidth="3" />
							<path d="M 22 110 A 48 48 0 0 1 98 110 Z" fill="#ffd6e4" />
							<g fill="#131316">
								<ellipse cx="40" cy="100" rx="2.5" ry="4" />
								<ellipse cx="60" cy="95" rx="2.5" ry="4" />
								<ellipse cx="80" cy="100" rx="2.5" ry="4" />
							</g>
							<path d="M 10 110 L 110 110" fill="none" stroke="#7CB342" strokeWidth="6" />
						</svg>

						{/* Pouch */}
						<div className="relative z-10 float-slow">
							<div className="relative w-[280px] sm:w-[360px] aspect-[4/5]">
								<svg
									viewBox="0 0 320 400"
									className="w-full h-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]"
								>
									<title>Sour Watermelon Pouch</title>
									<defs>
										<linearGradient id="pouchGrad" x1="0" y1="0" x2="1" y2="1">
											<stop offset="0%" stopColor="#9CCC65" />
											<stop offset="100%" stopColor="#7CB342" />
										</linearGradient>
									</defs>
									{/* Top zigzag tear */}
									<path
										d="M 20 30 L 40 22 L 60 30 L 80 22 L 100 30 L 120 22 L 140 30 L 160 22 L 180 30 L 200 22 L 220 30 L 240 22 L 260 30 L 280 22 L 300 30 L 300 380 L 20 380 Z"
										fill="url(#pouchGrad)"
										stroke="#131316"
										strokeWidth="4"
									/>
									{/* Hanger hole */}
									<circle cx="160" cy="40" r="8" fill="#131316" />
									{/* Sour banner */}
									<g transform="translate(40 60) rotate(-8)">
										<rect x="0" y="0" width="120" height="34" rx="4" fill="#131316" />
										<text
											x="60"
											y="24"
											textAnchor="middle"
											fontSize="22"
											fontWeight="900"
											fill="#F9D34A"
											fontFamily="var(--font-display)"
										>
											SOUR
										</text>
									</g>
									{/* Real honey badge */}
									<g transform="translate(190 70)">
										<circle cx="20" cy="20" r="22" fill="#FFC107" stroke="#131316" strokeWidth="3" />
										<text x="20" y="15" textAnchor="middle" fontSize="6" fontWeight="700" fill="#131316">
											MADE WITH
										</text>
										<text x="20" y="24" textAnchor="middle" fontSize="7" fontWeight="800" fill="#131316">
											REAL
										</text>
										<text x="20" y="32" textAnchor="middle" fontSize="7" fontWeight="800" fill="#131316">
											HONEY
										</text>
									</g>
									{/* Main brand */}
									<text
										x="160"
										y="190"
										textAnchor="middle"
										fontSize="76"
										fontWeight="900"
										fill="#ffffff"
										stroke="#131316"
										strokeWidth="4"
										fontFamily="var(--font-display)"
										letterSpacing="-2"
									>
										YNS
									</text>
									<text
										x="160"
										y="250"
										textAnchor="middle"
										fontSize="54"
										fontWeight="900"
										fill="#ffffff"
										stroke="#131316"
										strokeWidth="4"
										fontFamily="var(--font-display)"
										letterSpacing="-2"
									>
										FUEL
									</text>
									{/* Flavour */}
									<rect x="80" y="280" width="160" height="30" rx="15" fill="#131316" />
									<text
										x="160"
										y="301"
										textAnchor="middle"
										fontSize="14"
										fontWeight="800"
										fill="#ffffff"
										fontFamily="var(--font-display)"
										letterSpacing="1"
									>
										SOUR WATERMELON
									</text>
									{/* Decoration */}
									<circle cx="70" cy="330" r="14" fill="#E91E63" stroke="#131316" strokeWidth="2.5" />
									<circle cx="70" cy="330" r="9" fill="#ffd6e4" />
									<circle cx="250" cy="340" r="10" fill="#F9D34A" stroke="#131316" strokeWidth="2" />
									<text x="160" y="345" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
										FRUIT SNACKS · NON-GMO
									</text>
								</svg>
							</div>
						</div>

						{/* Bee mascot */}
						<svg
							viewBox="0 0 200 200"
							className="absolute -right-2 sm:right-6 bottom-0 h-32 w-32 sm:h-44 sm:w-44 wiggle z-20"
							style={{ animationDelay: "0.5s" }}
						>
							<title>Bee Mascot</title>
							{/* Trail */}
							<path
								d="M 200 100 Q 160 110 140 100"
								fill="none"
								stroke="#F9D34A"
								strokeWidth="6"
								strokeLinecap="round"
								strokeDasharray="2 6"
							/>
							{/* Body */}
							<ellipse cx="100" cy="115" rx="55" ry="45" fill="#F9D34A" stroke="#131316" strokeWidth="4" />
							{/* Stripes */}
							<path d="M 65 90 Q 100 75 135 90" fill="none" stroke="#131316" strokeWidth="10" />
							<path d="M 60 120 Q 100 140 140 120" fill="none" stroke="#131316" strokeWidth="10" />
							{/* Wings */}
							<ellipse cx="70" cy="65" rx="22" ry="14" fill="#ffffffcc" stroke="#131316" strokeWidth="3" />
							<ellipse cx="130" cy="65" rx="22" ry="14" fill="#ffffffcc" stroke="#131316" strokeWidth="3" />
							{/* Sunglasses */}
							<rect x="70" y="90" width="22" height="14" rx="3" fill="#131316" />
							<rect x="108" y="90" width="22" height="14" rx="3" fill="#131316" />
							<line x1="92" y1="97" x2="108" y2="97" stroke="#131316" strokeWidth="3" />
							{/* Mouth */}
							<path
								d="M 90 130 Q 100 138 110 130"
								fill="none"
								stroke="#131316"
								strokeWidth="3"
								strokeLinecap="round"
							/>
							{/* Antennae */}
							<line x1="85" y1="60" x2="78" y2="40" stroke="#131316" strokeWidth="3" strokeLinecap="round" />
							<line
								x1="115"
								y1="60"
								x2="122"
								y2="40"
								stroke="#131316"
								strokeWidth="3"
								strokeLinecap="round"
							/>
							<circle cx="78" cy="38" r="4" fill="#131316" />
							<circle cx="122" cy="38" r="4" fill="#131316" />
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}
