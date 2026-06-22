import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden skylrk-atmosphere skylrk-grain">
			{/* Vignette */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none"
				style={{
					background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(6,26,38,0.9), transparent 70%)",
				}}
			/>

			{/* Central halo glow */}
			<div
				aria-hidden="true"
				className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] rounded-full skylrk-glow pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, rgba(166,201,214,0.45) 0%, rgba(63,217,214,0.15) 30%, transparent 65%)",
					filter: "blur(40px)",
				}}
			/>

			<div className="relative max-w-[1400px] mx-auto px-6 min-h-[640px] lg:min-h-[760px]">
				{/* Top meta strip */}
				<div className="pt-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/50">
					<span>[ FW 26 — drop 003 ]</span>
					<span className="hidden sm:inline">[ shipping worldwide ]</span>
					<span>[ 04:32 GMT ]</span>
				</div>

				{/* Floating product canvas */}
				<div className="relative h-[480px] sm:h-[560px] lg:h-[600px] mt-8">
					{/* hoodie left */}
					<div className="absolute left-[2%] top-[5%] w-[28%] max-w-[280px] skylrk-float-1">
						<div className="relative aspect-square">
							<Image
								src="/scraped-0.jpg"
								alt="Polka hoodie"
								fill
								className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
								sizes="(max-width: 768px) 50vw, 280px"
								priority
							/>
						</div>
					</div>

					{/* boxers center */}
					<div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[22%] max-w-[220px] skylrk-float-2">
						<div className="relative aspect-square">
							<Image
								src="/scraped-1.jpg"
								alt="Logo boxers"
								fill
								className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
								sizes="(max-width: 768px) 40vw, 220px"
								priority
							/>
						</div>
					</div>

					{/* phone case right */}
					<div className="absolute right-[3%] top-[22%] w-[14%] max-w-[140px] skylrk-float-3">
						<div className="relative aspect-square">
							<Image
								src="/scraped-3.jpg"
								alt="Cyan phone case"
								fill
								className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
								sizes="(max-width: 768px) 25vw, 140px"
							/>
						</div>
					</div>

					{/* camo hoodie lower mid */}
					<div className="absolute left-[28%] bottom-[2%] w-[26%] max-w-[260px] skylrk-float-4">
						<div className="relative aspect-square">
							<Image
								src="/scraped-2.jpg"
								alt="Camo hoodie"
								fill
								className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
								sizes="(max-width: 768px) 45vw, 260px"
							/>
						</div>
					</div>

					{/* camo pants lower right */}
					<div className="absolute right-[8%] bottom-[6%] w-[22%] max-w-[220px] skylrk-float-5">
						<div className="relative aspect-square">
							<Image
								src="/scraped-4.jpg"
								alt="Camo pants"
								fill
								className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
								sizes="(max-width: 768px) 40vw, 220px"
							/>
						</div>
					</div>
				</div>

				{/* Bottom CTA strip */}
				<div className="relative pb-16 pt-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
						<div className="max-w-xl">
							<p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
								[ new arrivals ]
							</p>
							<h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-foreground">
								Suspended in <span className="italic font-light text-cyan-200/90">stillness</span>.
								<br />
								Made for after-hours.
							</h1>
						</div>
						<div className="flex items-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center gap-2 h-11 px-6 bg-foreground text-background rounded-full text-[11px] font-mono uppercase tracking-[0.24em] hover:bg-cyan-200 transition-colors"
							>
								[ Shop the drop ]
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center gap-2 h-11 px-6 border border-border rounded-full text-[11px] font-mono uppercase tracking-[0.24em] text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors"
							>
								[ Lookbook ]
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
