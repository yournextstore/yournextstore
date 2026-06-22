import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden border-b-2 border-foreground yns-bg-sky-cloud">
			{/* Oversized vertical wordmark — left */}
			<div
				aria-hidden="true"
				className="absolute -left-4 sm:-left-8 top-0 bottom-0 hidden lg:flex items-center pointer-events-none"
			>
				<span className="font-display text-[18vw] leading-[0.85] tracking-tighter text-foreground/95 -rotate-90 origin-center whitespace-nowrap">
					YNS · 2026
				</span>
			</div>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
					{/* Configurator panel */}
					<div className="bg-white/70 backdrop-blur-sm border-2 border-foreground p-6 sm:p-8 lg:p-10 relative">
						<span className="absolute -top-3 left-6 yns-bg-lime border-2 border-foreground px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase">
							New · Custom Build
						</span>

						<h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl uppercase leading-[0.95] text-foreground">
							Build your first
							<br />
							<span className="text-foreground">customizable</span>
							<br />
							<span className="yns-bg-lime px-2 -mx-2 inline-block">drop.</span>
						</h1>

						<form className="mt-8 grid grid-cols-2 gap-3">
							<label className="col-span-1 flex flex-col gap-1">
								<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70">
									First name
								</span>
								<input
									type="text"
									placeholder="Alex"
									className="h-11 px-3 bg-white border-2 border-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
								/>
							</label>
							<label className="col-span-1 flex flex-col gap-1">
								<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70">
									Last name
								</span>
								<input
									type="text"
									placeholder="Doe"
									className="h-11 px-3 bg-white border-2 border-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
								/>
							</label>
							<label className="col-span-2 flex flex-col gap-1">
								<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70">
									Tell us your style
								</span>
								<input
									type="text"
									placeholder="e.g. soft pastels, chunky charms…"
									className="h-11 px-3 bg-white border-2 border-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
								/>
							</label>
							<label className="col-span-2 flex flex-col gap-1">
								<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70">
									Drop me a note
								</span>
								<textarea
									rows={3}
									placeholder="What should we know?"
									className="px-3 py-2 bg-white border-2 border-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
								/>
							</label>

							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="col-span-2 h-14 bg-foreground text-background font-display tracking-[0.15em] uppercase text-sm flex items-center justify-center gap-2 hover:bg-foreground/85 transition-colors"
							>
								Send Request
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</form>
					</div>

					{/* Product showcase panel */}
					<div className="relative border-2 border-foreground bg-gradient-to-br from-[#cde7f4] via-[#b8dcee] to-[#a8d2e8] overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-full">
						{/* Cloud blobs */}
						<div
							aria-hidden="true"
							className="absolute -top-12 -right-16 w-72 h-72 rounded-full bg-white/40 blur-3xl"
						/>
						<div
							aria-hidden="true"
							className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/30 blur-3xl"
						/>

						{/* Brutalist "CO" type bleeding bottom-left */}
						<span
							aria-hidden="true"
							className="absolute -bottom-6 -left-2 font-display text-[20vw] sm:text-[12rem] lg:text-[14rem] leading-[0.8] text-foreground/95"
						>
							CO
						</span>
						{/* Brutalist "ON" type top-right */}
						<span
							aria-hidden="true"
							className="absolute top-4 -right-2 font-display text-[14vw] sm:text-[8rem] lg:text-[10rem] leading-[0.8] text-foreground/95"
						>
							ON
						</span>

						{/* Hotspot callouts */}
						<div className="absolute top-[22%] left-[18%] hidden sm:block">
							<div className="flex items-start gap-2">
								<span className="h-6 w-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
									1
								</span>
								<div className="bg-white border border-foreground px-2.5 py-1.5 text-[10px] leading-tight max-w-[140px] shadow-[2px_2px_0_0_#0f0f0f]">
									Lightweight resin shell, breathable all-day comfort.
								</div>
							</div>
						</div>

						<div className="absolute top-[55%] left-[8%] hidden sm:block">
							<div className="flex items-start gap-2">
								<span className="h-6 w-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
									2
								</span>
								<div className="bg-white border border-foreground px-2.5 py-1.5 text-[10px] leading-tight max-w-[150px] shadow-[2px_2px_0_0_#0f0f0f]">
									Snap-fit charms — make every pair entirely yours.
								</div>
							</div>
						</div>

						<div className="absolute top-[30%] right-[10%] hidden sm:block">
							<div className="flex items-start gap-2">
								<div className="bg-white border border-foreground px-2.5 py-1.5 text-[10px] leading-tight max-w-[140px] shadow-[2px_2px_0_0_#0f0f0f] text-right">
									Recycled rubber outsole, grip-tested in 4 cities.
								</div>
								<span className="h-6 w-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
									3
								</span>
							</div>
						</div>

						<div className="absolute bottom-[18%] right-[14%] hidden sm:block">
							<div className="flex items-start gap-2">
								<div className="bg-white border border-foreground px-2.5 py-1.5 text-[10px] leading-tight max-w-[150px] shadow-[2px_2px_0_0_#0f0f0f] text-right">
									Removable strap, 4 colorways at launch.
								</div>
								<span className="h-6 w-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
									4
								</span>
							</div>
						</div>

						{/* Center product image (SVG clog placeholder) */}
						<div className="absolute inset-0 flex items-center justify-center">
							<svg
								viewBox="0 0 320 220"
								className="w-2/3 sm:w-1/2 drop-shadow-[8px_12px_0_rgba(15,15,15,0.15)]"
								aria-hidden="true"
							>
								<title>Custom build preview</title>
								{/* clog silhouette */}
								<path
									d="M50 130 Q50 80 110 70 Q170 60 230 65 Q280 70 285 110 Q288 145 270 160 Q230 180 170 178 Q90 178 60 165 Q40 155 50 130 Z"
									fill="#ffffff"
									stroke="#0f0f0f"
									strokeWidth="3"
								/>
								<path
									d="M55 145 Q120 168 230 168 Q275 168 285 155"
									fill="none"
									stroke="#0f0f0f"
									strokeWidth="2.5"
								/>
								{/* holes */}
								{[90, 130, 170, 210, 250].map((cx) => (
									<circle
										key={`r1-${cx}`}
										cx={cx}
										cy={100}
										r={7}
										fill="#cde7f4"
										stroke="#0f0f0f"
										strokeWidth="2"
									/>
								))}
								{[110, 150, 190, 230].map((cx) => (
									<circle
										key={`r2-${cx}`}
										cx={cx}
										cy={125}
										r={6}
										fill="#cde7f4"
										stroke="#0f0f0f"
										strokeWidth="2"
									/>
								))}
								{/* strap */}
								<path d="M250 100 Q295 90 285 145" fill="none" stroke="#0f0f0f" strokeWidth="3" />
								{/* heel */}
								<ellipse cx="275" cy="125" rx="10" ry="6" fill="#d4ff3a" stroke="#0f0f0f" strokeWidth="2" />
							</svg>
						</div>

						{/* Star sparkle */}
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							className="absolute top-6 left-6 w-7 h-7 text-foreground"
						>
							<title>Sparkle</title>
							<path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" fill="currentColor" />
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}
