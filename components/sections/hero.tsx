import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative">
			{/* top tagline row */}
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-6 flex flex-wrap items-end justify-between gap-6">
				<div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
					<span className="inline-block h-px w-10 bg-foreground/40" />
					Curated since 2018
				</div>
				<p className="yns-display max-w-md text-[28px] sm:text-[34px] leading-[1.05] text-foreground">
					Create a home that&apos;s
					<span className="italic"> uniquely yours.</span>
				</p>
				<YnsLink
					href="#products"
					className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium"
				>
					Shop the look
					<ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</YnsLink>
			</div>

			{/* main hero stage */}
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="relative overflow-hidden rounded-[28px] yns-hero-gradient">
					{/* photographic interior overlay */}
					<div className="absolute inset-0">
						<Image
							src="/scraped-5.jpg"
							alt="Sunlit interior space"
							fill
							priority
							sizes="100vw"
							className="object-cover opacity-90 mix-blend-multiply"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#2b1e18]/55 via-[#2b1e18]/15 to-transparent" />
						<div className="absolute inset-0 bg-gradient-to-r from-[#2b1e18]/40 via-transparent to-[#2b1e18]/20" />
					</div>

					{/* top in-stage chrome */}
					<div className="relative flex items-start justify-between p-6 sm:p-10 z-10">
						<div className="flex items-center gap-3 text-background/85">
							<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/10 backdrop-blur-md ring-1 ring-background/20 yns-display text-base">
								Y
							</span>
							<span className="text-xs tracking-[0.22em] uppercase">Spring · Volume 12</span>
						</div>
						<div className="hidden sm:flex items-center gap-4 text-[11px] tracking-[0.22em] uppercase text-background/70">
							<span>Living</span>
							<span className="h-px w-6 bg-background/30" />
							<span>Lighting</span>
							<span className="h-px w-6 bg-background/30" />
							<span>Textiles</span>
						</div>
					</div>

					{/* hero copy block */}
					<div className="relative z-10 px-6 sm:px-10 pt-10 sm:pt-12 pb-8 sm:pb-12 max-w-2xl">
						<div className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur-md ring-1 ring-background/25 px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-background/90">
							<span className="h-1.5 w-1.5 rounded-full bg-yns-sun" />
							Now arriving
						</div>
						<p className="mt-6 yns-display text-background text-3xl sm:text-4xl leading-[1.1]">
							Create a Home
							<br />
							That&apos;s Uniquely You
						</p>
						<p className="mt-5 text-background/80 text-base max-w-md leading-relaxed">
							Sculpted lighting, hand-finished ceramics and rich, considered textures — all designed to feel
							lived-in from the moment you place them.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<YnsLink
								href="#products"
								className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-background/90 transition-colors"
							>
								Shop the collection
								<ArrowUpRightIcon className="h-4 w-4" />
							</YnsLink>
							<YnsLink
								href="#story"
								className="inline-flex items-center gap-2 rounded-full bg-background/10 ring-1 ring-background/30 text-background backdrop-blur-md px-6 py-3 text-sm font-medium hover:bg-background/20 transition-colors"
							>
								Our story
							</YnsLink>
						</div>
					</div>

					{/* gigantic HOMEDECOR-style display word */}
					<div className="relative z-10 px-2 sm:px-6 pb-8 sm:pb-10 pointer-events-none">
						<p className="yns-display select-none text-background leading-[0.85] tracking-[-0.04em] text-[20vw] sm:text-[16vw] lg:text-[14vw] font-medium">
							<span className="bg-gradient-to-b from-background to-background/40 bg-clip-text text-transparent">
								YOUR NEXT STORE
							</span>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
