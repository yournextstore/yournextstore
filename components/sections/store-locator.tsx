export function StoreLocator() {
	return (
		<section className="relative bg-[var(--color-leaf-deep)] text-white overflow-hidden border-b-2 border-foreground/10">
			{/* Decorative grid pattern */}
			<svg
				aria-hidden
				className="absolute inset-0 w-full h-full opacity-10"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
			>
				<title>map</title>
				<defs>
					<pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
						<path d="M 6 0 L 0 0 0 6" fill="none" stroke="white" strokeWidth="0.4" />
					</pattern>
				</defs>
				<rect width="100" height="100" fill="url(#grid)" />
				<path d="M0 60 Q30 40 50 55 T100 50" stroke="white" strokeWidth="0.6" fill="none" opacity="0.6" />
				<path d="M0 30 Q40 70 70 35 T100 70" stroke="white" strokeWidth="0.6" fill="none" opacity="0.6" />
			</svg>

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-butter)] mb-4">
						<span className="inline-block w-8 h-px bg-current align-middle mr-3" />
						Find us in the wild
					</p>
					<h2 className="display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
						Stocked at
						<br />
						<span className="text-[var(--color-butter)] italic">800+</span> shops
					</h2>
					<p className="mt-6 text-lg leading-relaxed text-white/80 max-w-md">
						Pop into your local independent grocer, juice bar, or specialty coffee shop &mdash; we&rsquo;re
						probably already there.
					</p>

					<form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md">
						<input
							type="text"
							placeholder="Zip code"
							aria-label="Zip code"
							maxLength={10}
							className="h-12 flex-1 rounded-full bg-white/95 text-foreground px-6 outline-none placeholder:text-foreground/40 focus:ring-2 focus:ring-[var(--color-butter)] font-medium"
						/>
						<button
							type="submit"
							className="h-12 inline-flex items-center justify-center px-7 bg-[var(--color-butter)] text-foreground rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
						>
							Find shop
						</button>
					</form>

					<div className="mt-8 flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/70">
						<div>
							<div className="display text-3xl text-white">800+</div>
							<div className="mt-1">Stores</div>
						</div>
						<div className="w-px h-10 bg-white/20" />
						<div>
							<div className="display text-3xl text-white">42</div>
							<div className="mt-1">States</div>
						</div>
						<div className="w-px h-10 bg-white/20" />
						<div>
							<div className="display text-3xl text-white">12</div>
							<div className="mt-1">Cafés</div>
						</div>
					</div>
				</div>

				{/* Fake map illustration */}
				<div className="relative aspect-[5/4] rounded-3xl overflow-hidden border-4 border-white/30 bg-[var(--color-leaf)]">
					<svg aria-hidden viewBox="0 0 400 320" className="w-full h-full">
						<title>map illustration</title>
						<rect width="400" height="320" fill="var(--color-leaf)" />
						{/* Land masses */}
						<path
							d="M30 50 Q80 30 120 60 L180 50 Q240 80 290 60 L370 90 L370 160 Q320 180 280 160 L220 180 Q150 160 100 200 L40 180 Z"
							fill="var(--color-butter-soft)"
							opacity="0.7"
						/>
						<path
							d="M50 220 Q120 200 200 230 L300 220 Q360 250 380 280 L40 290 Z"
							fill="var(--color-cream)"
							opacity="0.5"
						/>
						{/* Roads */}
						<path
							d="M40 120 Q150 100 280 130 T380 150"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeDasharray="4 4"
							opacity="0.8"
						/>
						<path
							d="M80 60 Q120 140 160 220 T230 290"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeDasharray="4 4"
							opacity="0.8"
						/>
						{/* Pins */}
						{[
							{ x: 90, y: 100, c: "var(--color-pink)", label: "1" },
							{ x: 180, y: 80, c: "var(--color-cobalt)", label: "2" },
							{ x: 240, y: 160, c: "var(--color-espresso)", label: "3" },
							{ x: 130, y: 200, c: "var(--color-pink)", label: "4" },
							{ x: 310, y: 230, c: "var(--color-cobalt)", label: "5" },
							{ x: 60, y: 250, c: "var(--color-espresso)", label: "6" },
						].map((p) => (
							<g key={p.label}>
								<circle cx={p.x} cy={p.y + 4} rx="8" ry="2.5" fill="black" opacity="0.2" />
								<path
									d={`M${p.x} ${p.y - 18} a8 8 0 1 1 -0.01 0 z M${p.x - 5} ${p.y - 12} l 5 8 l 5 -8 z`}
									fill={p.c}
									stroke="white"
									strokeWidth="1.5"
								/>
								<circle cx={p.x} cy={p.y - 18} r="3" fill="white" />
							</g>
						))}
					</svg>
				</div>
			</div>
		</section>
	);
}
