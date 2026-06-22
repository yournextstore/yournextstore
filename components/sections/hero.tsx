import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-16">
				<div className="hero-card relative overflow-hidden rounded-3xl">
					{/* Subtle grid layer */}
					<div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />

					{/* Inner radial neon glow */}
					<div
						aria-hidden="true"
						className="absolute -right-32 top-1/2 -translate-y-1/2 h-[640px] w-[640px] rounded-full pointer-events-none"
						style={{
							background:
								"radial-gradient(closest-side, rgba(217,70,196,0.35), rgba(168,85,247,0.18) 45%, transparent 70%)",
							filter: "blur(20px)",
						}}
					/>

					<div className="relative grid lg:grid-cols-12 gap-8 lg:gap-4 items-center px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20">
						<div className="lg:col-span-6 relative z-10">
							<div className="inline-flex items-center gap-2 mb-6 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
								<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
								<span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
									New season · 2026 lineup
								</span>
							</div>

							<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[0.95] neon-glow-text">
								Designed for
								<br />
								<span className="bg-gradient-to-r from-[#f5f3f7] via-[#f0c1ff] to-[#d946c4] bg-clip-text text-transparent">
									Performance
								</span>
							</h1>

							<p className="mt-6 max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
								Upgrade, enhance, and customize your setup with high-quality computer components and
								tournament-ready custom builds.
							</p>

							<div className="mt-10 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="btn-neon inline-flex h-12 items-center justify-center gap-2 px-7 rounded-full text-sm font-semibold text-white transition-all"
								>
									Buy PC
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="ghost-pill inline-flex h-12 items-center justify-center gap-2 px-7 rounded-full text-sm font-medium text-foreground transition-all"
								>
									Start assembly
								</YnsLink>
							</div>

							{/* Stat strip */}
							<div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
								{[
									{ k: "12k+", l: "Custom builds" },
									{ k: "4.9★", l: "Rated by builders" },
									{ k: "2-yr", l: "Warranty included" },
								].map((s) => (
									<div key={s.l} className="border-l border-white/10 pl-3">
										<div className="font-display text-xl font-semibold text-foreground">{s.k}</div>
										<div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
											{s.l}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Hero visual — abstract custom inline SVG/CSS PC tower */}
						<div className="lg:col-span-6 relative h-[300px] sm:h-[420px] lg:h-[520px]">
							<HeroPcTower />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function HeroPcTower() {
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			{/* Soft ambient blob behind */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(55% 55% at 65% 50%, rgba(217,70,196,0.45), rgba(168,85,247,0.15) 45%, transparent 75%)",
					filter: "blur(20px)",
				}}
			/>

			<div className="relative w-[300px] sm:w-[420px] lg:w-[520px] aspect-[1/1.05] float-slow">
				{/* Outer chassis */}
				<div
					className="absolute inset-0 rounded-[28px]"
					style={{
						background: "linear-gradient(180deg, #1d1b22 0%, #0e0d12 60%, #050507 100%)",
						boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 60px 80px -30px rgba(0,0,0,0.7)",
						border: "1px solid rgba(255,255,255,0.08)",
					}}
				/>

				{/* Top panel */}
				<div
					className="absolute left-3 right-3 top-3 h-5 rounded-t-[20px]"
					style={{
						background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.01))",
						borderBottom: "1px solid rgba(255,255,255,0.05)",
					}}
				/>

				{/* Front mesh perforation panel (top half) */}
				<div
					className="absolute left-5 right-5 top-10 bottom-1/2 rounded-md"
					style={{
						backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1.4px)",
						backgroundSize: "8px 8px",
						maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.4) 100%)",
					}}
				/>

				{/* Tempered glass side panel — RGB interior */}
				<div
					className="absolute left-1/2 right-5 top-12 bottom-12 rounded-lg overflow-hidden"
					style={{
						background:
							"linear-gradient(135deg, rgba(217,70,196,0.15), rgba(168,85,247,0.08) 60%, rgba(0,0,0,0.6))",
						border: "1px solid rgba(255,255,255,0.06)",
						boxShadow: "inset 0 0 60px rgba(217,70,196,0.35)",
					}}
				>
					{/* RGB fans */}
					<div className="absolute inset-3 grid grid-rows-2 gap-3">
						<div className="grid grid-cols-2 gap-3">
							<RgbFan />
							<RgbFan />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<RgbFan />
							<RgbFan />
						</div>
					</div>
					{/* Glass reflection */}
					<div
						aria-hidden="true"
						className="absolute inset-0 pointer-events-none"
						style={{
							background:
								"linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)",
						}}
					/>
				</div>

				{/* Vertical neon accent strip */}
				<div
					className="absolute left-3 top-12 bottom-12 w-[3px] rounded-full"
					style={{
						background: "linear-gradient(180deg, #d946c4, #a855f7)",
						boxShadow: "0 0 18px rgba(217,70,196,0.7)",
					}}
				/>

				{/* Bottom mesh */}
				<div
					className="absolute left-5 right-5 bottom-7 h-6 rounded-md"
					style={{
						backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 4px)",
						backgroundSize: "4px 4px",
					}}
				/>

				{/* Feet */}
				<div className="absolute left-7 bottom-1 h-2 w-10 rounded-full bg-black/60 blur-[1px]" />
				<div className="absolute right-7 bottom-1 h-2 w-10 rounded-full bg-black/60 blur-[1px]" />
			</div>
		</div>
	);
}

function RgbFan() {
	return (
		<div className="relative rounded-md overflow-hidden bg-[#0a090c] border border-white/5">
			{/* glow ring */}
			<div
				className="absolute inset-1 rounded-sm"
				style={{
					background: "conic-gradient(from 0deg, #d946c4, #a855f7, #d946c4)",
					filter: "blur(6px)",
					opacity: 0.55,
				}}
			/>
			<div className="absolute inset-2 rounded-full border border-white/15" />
			<div
				className="absolute inset-3 rounded-full"
				style={{
					background:
						"radial-gradient(circle, rgba(217,70,196,0.7), rgba(168,85,247,0.3) 60%, transparent 80%)",
				}}
			/>
			{/* fan blades */}
			<div className="absolute inset-3 rounded-full">
				{[0, 60, 120, 180, 240, 300].map((deg) => (
					<div
						key={deg}
						className="absolute left-1/2 top-1/2 h-1/2 w-[18%] -translate-x-1/2 origin-bottom rounded-sm bg-white/10"
						style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
					/>
				))}
			</div>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white/40" />
		</div>
	);
}
