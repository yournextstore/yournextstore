import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden editorial-window-light">
			{/* Dot grid backdrop */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-50"
				style={{
					backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.5 0.03 60 / 0.18) 1px, transparent 0)",
					backgroundSize: "26px 26px",
				}}
			/>

			{/* Soft window-light wash from top-left */}
			<div
				aria-hidden="true"
				className="absolute -top-40 -left-40 w-[60vw] h-[60vw] pointer-events-none"
				style={{
					background: "radial-gradient(closest-side, oklch(1 0 0 / 0.55), transparent 70%)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Editorial frame */}
				<div className="relative pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-28 lg:pb-32 min-h-[78vh] flex flex-col">
					{/* Headline block – two-line italic serif with image layered behind */}
					<div className="relative flex-1 flex flex-col justify-center">
						{/* Top line */}
						<div className="relative z-20 flex items-end gap-3">
							<span className="editorial-eyebrow text-muted-foreground hidden sm:inline-block pb-3">
								(The)
							</span>
							<h1 className="font-display italic text-foreground leading-[0.85] tracking-[-0.04em] text-[18vw] sm:text-[16vw] lg:text-[15rem]">
								<span className="block">Curated</span>
							</h1>
						</div>

						{/* Layered chair / product image */}
						<div
							aria-hidden="true"
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[58%] sm:w-[46%] lg:w-[38%] aspect-[3/4] pointer-events-none editorial-float"
						>
							<Image
								src="/scraped-0.jpg"
								alt=""
								fill
								priority
								sizes="(min-width: 1024px) 38vw, (min-width: 640px) 46vw, 58vw"
								className="object-contain drop-shadow-[0_40px_70px_oklch(0.3_0.05_60/0.22)]"
							/>
						</div>

						{/* Bottom line */}
						<div className="relative z-20 mt-4 sm:mt-6 lg:mt-8 flex items-start gap-3 justify-end">
							<h1
								className="font-display italic text-foreground leading-[0.85] tracking-[-0.04em] text-[18vw] sm:text-[16vw] lg:text-[15rem]"
								aria-hidden="false"
							>
								<span className="block">Collection</span>
							</h1>
							<span className="editorial-eyebrow text-muted-foreground hidden sm:inline-block pt-4">
								(N°7)
							</span>
						</div>
					</div>

					{/* Metadata row — left / right columns + promo card */}
					<div className="relative z-20 mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
						{/* Left column */}
						<div className="max-w-xs">
							<p className="editorial-eyebrow text-muted-foreground">Est. 2024 · Vol. Seven</p>
							<p className="mt-3 text-[0.78rem] leading-relaxed text-muted-foreground">
								Celebrating the considered objects that quietly shape a home — chairs, lighting, and everyday
								essentials built to outlast their season.
							</p>
						</div>

						{/* Center column - "iconic shape" */}
						<div className="hidden sm:flex flex-col items-start lg:items-center sm:text-left lg:text-center">
							<span className="editorial-eyebrow text-foreground">
								iconic shape <span className="text-muted-foreground/60 px-1">/</span> modern design
							</span>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="mt-3 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] font-medium border-b border-foreground/30 hover:border-foreground transition-colors pb-0.5"
							>
								Configure your piece
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}
									className="h-3.5 w-3.5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
								</svg>
							</YnsLink>
						</div>

						{/* Right column - promo card */}
						<div className="flex justify-start lg:justify-end">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group flex items-center gap-4 rounded-xl bg-background/70 backdrop-blur-md border border-border/60 p-2 pr-5 hover:border-foreground/40 transition-colors"
							>
								<div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[oklch(0.78_0.12_55)]">
									<Image
										src="/scraped-1.jpg"
										alt="Featured piece — The Studio"
										fill
										sizes="64px"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								</div>
								<div className="flex flex-col">
									<span className="editorial-eyebrow text-muted-foreground">Featured</span>
									<span className="font-display italic text-base text-foreground">The Studio</span>
								</div>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.4}
									className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
								</svg>
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Hairline corner brackets — editorial frame */}
			<CornerBracket className="absolute top-6 left-6 sm:top-8 sm:left-8" />
			<CornerBracket className="absolute top-6 right-6 sm:top-8 sm:right-8" rotate={90} />
			<CornerBracket className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8" rotate={180} />
			<CornerBracket className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8" rotate={270} />
		</section>
	);
}

function CornerBracket({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className={`pointer-events-none h-4 w-4 text-foreground/40 ${className}`}
			style={{ transform: `rotate(${rotate}deg)` }}
		>
			<path d="M2 8V2h6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
		</svg>
	);
}
