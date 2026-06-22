import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden">
			{/* Backdrop: sheer-curtain CSS gradient */}
			<div aria-hidden="true" className="absolute inset-0 bg-sheer-curtain" />
			{/* Soft vignette */}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#e8b7ae]/30"
			/>

			{/* Right image — editorial product photography */}
			<div className="absolute inset-y-0 right-0 z-0 hidden w-[58%] md:block lg:w-[52%]">
				<div className="relative h-full w-full">
					<Image
						src="/scraped-0.jpg"
						alt=""
						fill
						priority
						sizes="(max-width: 1024px) 60vw, 50vw"
						className="object-cover object-[center_top]"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#f2d7d0] via-[#f2d7d0]/40 to-transparent"
					/>
				</div>
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid min-h-[70vh] grid-cols-1 items-center gap-8 py-16 md:min-h-[78vh] md:grid-cols-2 md:py-24 lg:min-h-[82vh]">
					<div className="max-w-xl">
						<h1
							className="font-display text-[clamp(3rem,7vw,5.75rem)] font-light italic leading-[0.92] tracking-[-0.01em] text-foreground"
							style={{ fontFamily: "var(--font-cormorant)" }}
						>
							Elevate
							<br />
							Your Everyday
						</h1>

						<div className="mt-10 space-y-2">
							<p className="text-[24px] font-bold uppercase tracking-[0.08em] text-foreground sm:text-[28px]">
								Bras Now
							</p>
							<p className="font-sans text-[80px] font-black leading-none tracking-[-0.04em] text-foreground sm:text-[104px]">
								<span className="align-top text-[42px] sm:text-[54px]">$</span>
								49
								<span className="align-top text-[34px] sm:text-[42px]">.99</span>
							</p>
							<p className="pt-2 text-[15px] font-bold uppercase tracking-[0.16em] text-foreground">
								Selected Styles
							</p>
						</div>

						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-14 w-full max-w-[280px] items-center justify-center rounded-full bg-white px-10 text-[13px] font-bold uppercase tracking-[0.22em] text-foreground shadow-[0_8px_30px_rgba(26,20,16,0.08)] transition-all hover:bg-foreground hover:text-cream"
							>
								Shop Now
							</YnsLink>
						</div>

						<p className="mt-6 max-w-md text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/80">
							Offer available on selected styles only. Not in conjunction with any other offer.
						</p>
					</div>
					<div className="hidden md:block" />
				</div>
			</div>
		</section>
	);
}
