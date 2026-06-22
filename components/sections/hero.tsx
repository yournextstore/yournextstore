import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section
			className="relative overflow-hidden grain"
			style={{
				background:
					"linear-gradient(180deg, var(--cobalt) 0%, var(--cobalt) 70%, var(--cream) 70%, var(--cream) 100%)",
			}}
		>
			{/* angled cream foreground sweep */}
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 h-[42%] origin-bottom-left"
				style={{
					background: "var(--cream)",
					clipPath: "polygon(0 25%, 100% 0, 100% 100%, 0 100%)",
				}}
			/>

			{/* floating yellow specks */}
			<div
				aria-hidden
				className="absolute left-[6%] top-[18%] w-3 h-3 rounded-full bg-chartreuse opacity-80"
			/>
			<div
				aria-hidden
				className="absolute right-[12%] top-[60%] w-2 h-2 rounded-full bg-marigold opacity-70"
			/>
			<div
				aria-hidden
				className="absolute left-[18%] top-[68%] w-1.5 h-1.5 rounded-full bg-cream-dark opacity-60"
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="min-h-[640px] md:min-h-[720px] lg:min-h-[780px] grid lg:grid-cols-12 gap-8 items-center py-16 sm:py-20">
					{/* Left text block */}
					<div className="lg:col-span-5 z-10 text-cream">
						<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 backdrop-blur-sm border border-cream/20 text-[11px] font-medium tracking-[0.18em] uppercase">
							<span className="w-1.5 h-1.5 rounded-full bg-chartreuse" />
							Vol. 01 · Now Shipping
						</span>
						<h1 className="mt-6 font-display text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95] font-black tracking-tight">
							<span className="block">Ask this</span>
							<span
								className="block italic font-light"
								style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
							>
								store
							</span>
							<span className="block">a question.</span>
						</h1>
						<p className="mt-6 max-w-md text-base sm:text-lg text-cream/80 leading-relaxed">
							An interactive shop of books, journals, and curiosities for life&rsquo;s big decisions and
							little wonders.
						</p>
						<div className="mt-10 flex flex-wrap gap-4 items-center">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="group inline-flex items-center gap-2 h-12 px-7 bg-chartreuse text-ink rounded-full text-sm font-semibold tracking-[0.18em] uppercase shadow-[0_8px_30px_rgba(214,233,74,0.35)] hover:bg-chartreuse/90 transition-all"
							>
								Available Now
								<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-cream/80 hover:text-cream underline underline-offset-4 decoration-cream/40 hover:decoration-cream"
							>
								Read the story
							</YnsLink>
						</div>
					</div>

					{/* Right hero artwork */}
					<div className="lg:col-span-7 relative flex justify-center items-center">
						<HeroBook />
						{/* small mascot */}
						<div aria-hidden className="absolute right-[10%] top-[12%] w-12 h-12 wiggle">
							<svg viewBox="0 0 48 48" className="w-full h-full">
								<circle cx="24" cy="22" r="11" fill="var(--ink)" />
								<circle cx="20" cy="20" r="2" fill="var(--cream)" />
								<circle cx="20" cy="20" r="0.9" fill="var(--ink)" />
								<path
									d="M14 30 L8 38 M18 33 L14 42 M24 34 L24 44 M30 33 L34 42 M34 30 L40 38"
									stroke="var(--ink)"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								<circle cx="24" cy="14" r="2.5" fill="var(--chartreuse)" />
								<line x1="24" y1="16.5" x2="24" y2="11" stroke="var(--ink)" strokeWidth="1.5" />
							</svg>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function HeroBook() {
	return (
		<div className="relative w-[280px] sm:w-[360px] md:w-[440px] lg:w-[480px] aspect-[3/4] -rotate-6 drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]">
			{/* spine */}
			<div
				className="absolute -left-3 top-0 bottom-0 w-6 rounded-l-sm"
				style={{
					background: "linear-gradient(180deg, var(--chartreuse) 0%, #c9dc3a 100%)",
					boxShadow: "inset -2px 0 4px rgba(0,0,0,0.15)",
				}}
			/>
			{/* book cover */}
			<div
				className="relative w-full h-full rounded-sm overflow-hidden"
				style={{
					background: "linear-gradient(135deg, #f0e9d8 0%, var(--cream) 60%, #ddd3bd 100%)",
					boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
				}}
			>
				{/* canvas weave overlay */}
				<div
					aria-hidden
					className="absolute inset-0 opacity-50 mix-blend-multiply"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)",
					}}
				/>

				<div className="relative h-full p-7 sm:p-9 flex flex-col">
					{/* curved title */}
					<div className="flex-1 relative">
						<svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
							<defs>
								<path id="topArc" d="M 20 110 Q 160 -30 300 110" fill="none" />
								<path id="bottomArc" d="M 20 130 Q 160 290 300 130" fill="none" />
							</defs>
							<text
								fontFamily="var(--font-display), serif"
								fontWeight="900"
								fontSize="28"
								fill="var(--ink)"
								letterSpacing="2"
							>
								<textPath href="#topArc" startOffset="50%" textAnchor="middle">
									ASK THIS STORE
								</textPath>
							</text>
							<text
								fontFamily="var(--font-display), serif"
								fontWeight="900"
								fontSize="28"
								fill="var(--ink)"
								letterSpacing="2"
							>
								<textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
									A QUESTION
								</textPath>
							</text>
						</svg>

						{/* central door illustration */}
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%]">
							<div
								className="relative w-full aspect-[3/4] rounded-t-[40%] border-[3px] border-ink"
								style={{ background: "var(--cobalt)" }}
							>
								{/* inner door panel */}
								<div
									className="absolute inset-2 rounded-t-[38%] border-2 border-ink/80"
									style={{ background: "var(--cobalt-dark)" }}
								/>
								{/* yellow knob */}
								<div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-marigold" />
								{/* tiny figure */}
								<svg
									viewBox="0 0 24 36"
									className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-7"
									aria-hidden
								>
									<circle cx="12" cy="8" r="4" fill="var(--ink)" />
									<rect x="9" y="12" width="6" height="10" fill="var(--marigold)" />
									<line x1="9" y1="22" x2="7" y2="30" stroke="var(--ink)" strokeWidth="1.5" />
									<line x1="15" y1="22" x2="17" y2="30" stroke="var(--ink)" strokeWidth="1.5" />
								</svg>
							</div>
						</div>
					</div>

					{/* subtitle */}
					<div className="text-center mt-4">
						<p className="font-display italic text-[13px] sm:text-sm text-ink/80 leading-snug">
							An Interactive Journey to Find Wisdom
							<br /> for Your Big and Little Decisions
						</p>
						<p className="mt-3 font-display text-[15px] sm:text-base tracking-[0.25em] font-bold text-ink">
							YNS · VOL 01
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
