import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[var(--color-sky)] text-[var(--color-navy)]">
			{/* Ribbed-glass backdrop */}
			<div aria-hidden className="absolute inset-0 yns-ribbed opacity-90" />
			{/* Soft color blobs */}
			<div
				aria-hidden
				className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-yellow)] yns-blob"
			/>
			<div
				aria-hidden
				className="absolute -bottom-40 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[var(--color-coral)] yns-blob"
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 py-16 sm:py-20 lg:py-28 min-h-[560px]">
					{/* Left: copy */}
					<div className="lg:col-span-5 relative z-10">
						<p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--color-navy)]/70 mb-6">
							A fresher kind of clean
						</p>
						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-[var(--color-navy)]">
							The Top-Tasting
							<br />
							Toothpaste.
						</h1>
						<p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[var(--color-navy)]/75">
							An unexpectedly irresistible clean. Refreshing goodness crafted by world-class flavor houses.
							Fresh, sophisticated, and impossible to ignore.
						</p>
						<div className="mt-10 flex flex-wrap items-center gap-4">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group inline-flex items-center gap-3 rounded-full bg-white pl-2 pr-6 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-navy)] shadow-[0_10px_40px_-10px_rgba(30,36,54,0.35)] transition-transform hover:-translate-y-0.5"
							>
								<span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--color-mint)]">
									<Image
										src="/scraped-2.jpg"
										alt=""
										width={40}
										height={40}
										className="h-10 w-10 object-cover"
										aria-hidden
									/>
								</span>
								Shop Cocoshine
								<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-navy)] underline-offset-4 hover:underline"
							>
								Why YNS
							</YnsLink>
						</div>

						{/* mini trust strip */}
						<div className="mt-12 grid grid-cols-3 max-w-md gap-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-navy)]/70">
							<div>
								<div className="text-[var(--color-navy)] font-display text-lg">0%</div>
								Synthetic dyes
							</div>
							<div>
								<div className="text-[var(--color-navy)] font-display text-lg">10k+</div>
								5-star reviews
							</div>
							<div>
								<div className="text-[var(--color-navy)] font-display text-lg">Dentist</div>
								Recommended
							</div>
						</div>
					</div>

					{/* Right: product still-life */}
					<div className="lg:col-span-7 relative z-10">
						<div className="relative aspect-[5/4] sm:aspect-[6/5] lg:aspect-[7/6] w-full">
							{/* Tinted glass shelf */}
							<div
								aria-hidden
								className="absolute inset-x-6 bottom-6 h-3 rounded-full bg-[var(--color-sky)] mix-blend-multiply opacity-70"
							/>
							<div
								aria-hidden
								className="absolute inset-x-2 bottom-3 h-2 rounded-full bg-[var(--color-navy)]/15 blur-sm"
							/>

							{/* Floating tube renders */}
							<div className="absolute left-[6%] top-[8%] w-[34%] rotate-[-6deg] drop-shadow-[0_30px_40px_rgba(30,36,54,0.18)]">
								<TubeMock color="mint" label="Mint" />
							</div>
							<div className="absolute left-[34%] top-[2%] w-[32%] rotate-[3deg] drop-shadow-[0_30px_40px_rgba(30,36,54,0.18)]">
								<TubeMock color="sunshine" label="Pina" />
							</div>
							<div className="absolute right-[2%] top-[14%] w-[34%] rotate-[10deg] drop-shadow-[0_30px_40px_rgba(30,36,54,0.18)]">
								<TubeMock color="coral" label="Berry" />
							</div>

							{/* Glass tumbler with toothbrush stems */}
							<div className="absolute left-[18%] bottom-[6%] w-[40%] aspect-[3/4]">
								<div className="absolute inset-0 rounded-t-2xl rounded-b-3xl border-[3px] border-white/70 bg-white/25 backdrop-blur-md" />
								{/* brushes */}
								<div className="absolute left-[18%] -top-[35%] w-2 h-[80%] rounded-full bg-[var(--color-coral)]" />
								<div className="absolute left-[40%] -top-[40%] w-2 h-[90%] rounded-full bg-[var(--color-sunshine)]" />
								<div className="absolute left-[62%] -top-[32%] w-2 h-[78%] rounded-full bg-[var(--color-sky)] brightness-90" />
								{/* bristles */}
								<div className="absolute left-[14%] -top-[42%] w-3 h-2 rounded-sm bg-white" />
								<div className="absolute left-[36%] -top-[47%] w-3 h-2 rounded-sm bg-white" />
								<div className="absolute left-[58%] -top-[39%] w-3 h-2 rounded-sm bg-white" />
							</div>

							{/* Confetti dots */}
							<div
								aria-hidden
								className="absolute top-[18%] left-[60%] h-3 w-3 rounded-full bg-[var(--color-yellow)]"
							/>
							<div aria-hidden className="absolute top-[44%] right-[12%] h-2 w-2 rounded-full bg-white" />
							<div
								aria-hidden
								className="absolute bottom-[38%] left-[10%] h-2 w-2 rounded-full bg-[var(--color-coral)]"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function TubeMock({ color, label }: { color: "mint" | "sunshine" | "coral"; label: string }) {
	const palette = {
		mint: {
			bg: "bg-[var(--color-mint)]",
			ink: "text-emerald-900/90",
		},
		sunshine: {
			bg: "bg-[var(--color-sunshine)]",
			ink: "text-amber-900/85",
		},
		coral: {
			bg: "bg-[var(--color-coral)]",
			ink: "text-rose-900/90",
		},
	}[color];

	return (
		<div className={`relative aspect-[3/5] w-full rounded-[28px] ${palette.bg} overflow-hidden`}>
			{/* Bubbly graphic */}
			<div className="absolute inset-0 opacity-90">
				<span className="absolute top-[18%] left-[18%] h-6 w-6 rounded-full bg-white/40" />
				<span className="absolute top-[35%] left-[55%] h-10 w-10 rounded-full bg-white/35" />
				<span className="absolute top-[55%] left-[28%] h-8 w-8 rounded-full bg-white/40" />
				<span className="absolute top-[72%] left-[60%] h-5 w-5 rounded-full bg-white/45" />
				<span className="absolute top-[42%] left-[22%] h-4 w-4 rounded-full bg-white/55" />
			</div>
			{/* Cap */}
			<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-[78%] rounded-b-[12px] bg-[var(--color-navy)]/15" />
			{/* Label */}
			<div
				className={`relative z-10 px-4 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] ${palette.ink}`}
			>
				YNS
			</div>
			<div
				className={`absolute bottom-3 left-0 right-0 text-center text-xs font-bold uppercase tracking-[0.16em] ${palette.ink}`}
			>
				{label}
			</div>
		</div>
	);
}
