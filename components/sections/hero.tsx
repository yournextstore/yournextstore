import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden border-b-2 border-[color:var(--border)]">
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
				{/* LEFT — photographic stack on tinsel curtain */}
				<div className="relative bg-tinsel overflow-hidden">
					{/* Decorative gold tinsel glow */}
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-b from-yns-brown/20 via-transparent to-yns-brown/40"
					/>

					{/* Stacked product boxes */}
					<div className="relative h-full flex items-center justify-center px-6 sm:px-12 py-10">
						<div className="relative w-full max-w-md aspect-[3/4]">
							{/* Bow / ribbon decoration */}
							<svg
								aria-hidden="true"
								viewBox="0 0 200 200"
								className="absolute -top-6 left-2 w-40 sm:w-52 z-20 drop-shadow-[0_8px_12px_rgba(58,31,18,0.4)]"
							>
								<g fill="#d93a18">
									<ellipse cx="100" cy="100" rx="38" ry="58" transform="rotate(-30 100 100)" />
									<ellipse cx="100" cy="100" rx="38" ry="58" transform="rotate(30 100 100)" />
									<ellipse cx="100" cy="100" rx="58" ry="38" transform="rotate(0 100 100)" />
									<ellipse cx="100" cy="100" rx="58" ry="38" transform="rotate(60 100 100)" />
									<ellipse cx="100" cy="100" rx="58" ry="38" transform="rotate(-60 100 100)" />
								</g>
								<circle cx="100" cy="100" r="18" fill="#f04a23" />
								<circle cx="100" cy="100" r="10" fill="#d93a18" />
								{/* Ribbon tails */}
								<path d="M88 130 Q 70 180, 60 220 L 80 215 Q 90 175, 100 145 Z" fill="#d93a18" />
								<path d="M112 130 Q 130 175, 140 215 L 120 220 Q 110 180, 100 150 Z" fill="#f04a23" />
							</svg>

							{/* Three stacked boxes */}
							<div className="absolute inset-0 flex flex-col gap-1">
								{[0, 1, 2].map((i) => (
									<div
										key={i}
										className="relative flex-1 bg-yns-red border-y-4 border-yns-red-dark overflow-hidden shadow-2xl"
									>
										<div
											aria-hidden="true"
											className="absolute inset-0 bg-gradient-to-br from-yns-red via-yns-red to-yns-red-dark"
										/>
										{i === 0 && (
											<div className="relative h-full flex items-center justify-center px-4 pt-4">
												<div className="font-display text-yns-cream-soft text-5xl sm:text-6xl tracking-tight drop-shadow-[2px_2px_0_rgba(58,31,18,0.4)]">
													Your<span className="text-yns-yellow">&apos;</span>NS
												</div>
												<sup className="text-yns-cream-soft text-xs ml-1">™</sup>
											</div>
										)}
										{i === 1 && (
											<div className="relative h-full flex items-center justify-between px-6 text-yns-cream-soft">
												<div className="font-display text-base sm:text-lg">JOIN THE CLUB</div>
												<div className="font-display text-xs sm:text-sm opacity-90">#YNSCRUNCH</div>
											</div>
										)}
										{i === 2 && (
											<div className="relative h-full flex items-center justify-center text-yns-cream-soft">
												<div className="font-display text-base sm:text-lg tracking-wider">CHEF CREATED</div>
											</div>
										)}
										{/* Dashed seam */}
										<div
											aria-hidden="true"
											className="absolute inset-x-0 bottom-2 border-b border-dashed border-yns-cream-soft/40"
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* RIGHT — cream side with headline */}
				<div className="relative bg-cream-grain flex items-center">
					<div className="w-full px-6 sm:px-12 lg:px-16 py-16 lg:py-24 max-w-xl mx-auto lg:mx-0 lg:ml-8">
						<div className="text-right lg:text-right">
							<h1 className="font-display text-yns-red text-6xl sm:text-7xl lg:text-[110px] leading-[0.92] tracking-tight drop-shadow-[1px_1px_0_rgba(255,247,224,1)]">
								Crunch worth
								<br />
								<span className="italic inline-block -mr-2">gifting</span>
							</h1>
							<p className="mt-6 text-yns-brown/80 text-base sm:text-lg italic max-w-md ml-auto">
								Perfect for holiday parties, potlucks, and &ldquo;I didn&apos;t know what to bring&rdquo;
								moments.
							</p>
							<div className="mt-8 flex justify-end">
								<YnsLink prefetch={"eager"} href="/products" className="btn-pill">
									Shop all flavor packs
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
