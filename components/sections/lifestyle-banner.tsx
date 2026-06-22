import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function LifestyleBanner() {
	return (
		<section className="relative isolate overflow-hidden bg-mahogany-radial text-cream">
			<div className="absolute inset-0 -z-10 opacity-20 mix-blend-screen">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle at 20% 20%, rgba(245,229,200,0.4), transparent 35%), radial-gradient(circle at 80% 80%, rgba(217,67,39,0.3), transparent 40%)",
					}}
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] sm:aspect-[5/6] w-full max-w-md rounded-[2rem] overflow-hidden border-4 border-cream/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
							<Image
								src="/scraped-0.jpg"
								alt="Snack pouches in lifestyle setting"
								fill
								sizes="(max-width: 1024px) 90vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-mahogany/40 via-transparent to-transparent" />
						</div>

						{/* Floating sticker */}
						<div className="absolute -top-4 -right-4 sm:right-6 rotate-12 bg-chili text-cream rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(217,67,39,0.4)] font-display uppercase border-4 border-cream/20">
							<span className="text-[10px] tracking-[0.2em]">Snack</span>
							<span className="text-xl leading-none">Time</span>
							<span className="text-[10px] tracking-[0.2em]">Anytime</span>
						</div>
					</div>

					<div>
						<p className="font-display text-[11px] tracking-[0.32em] uppercase text-cream/70">
							The everyday snack
						</p>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] uppercase">
							Built for the <span className="text-chili">in-between</span> moments.
						</h2>
						<p className="mt-6 text-base sm:text-lg text-cream/80 leading-relaxed max-w-lg">
							Post-workout. Pre-meeting. Trail mix? Skip it. We made a snack that travels light, hits hard,
							and doesn&apos;t lecture you about your macros.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							{["3pm slump", "Hike fuel", "Desk drawer", "Movie night"].map((tag) => (
								<span
									key={tag}
									className="rounded-full border border-cream/30 px-4 py-1.5 text-xs uppercase tracking-widest font-semibold text-cream/90"
								>
									{tag}
								</span>
							))}
						</div>

						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 font-display text-sm uppercase tracking-[0.18em] text-charcoal hover:bg-chili hover:text-cream transition-colors"
						>
							Shop all flavors
							<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
