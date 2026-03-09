import { YnsLink } from "@/components/yns-link";

export function PromoBanners() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<YnsLink prefetch={"eager"} href="#products" className="group block">
					<div
						className="relative overflow-hidden p-8 sm:p-12 min-h-[280px] flex flex-col justify-end"
						style={{
							background: "linear-gradient(135deg, #e8d5c4 0%, #f0e6dc 40%, #d4c4b0 100%)",
						}}
					>
						<div className="absolute top-6 left-8 sm:top-8 sm:left-12">
							<p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">New Arrivals</p>
						</div>
						<div>
							<h3 className="font-heading text-2xl sm:text-3xl font-light text-foreground leading-tight">
								TOUCH OF
								<br />
								<span className="font-semibold">COLOR</span>
							</h3>
							<p className="text-xs text-foreground/60 mt-2 max-w-[200px]">
								Essential styles come alive in bright colors.
							</p>
							<span className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-foreground/70 border-b border-foreground/30 pb-0.5 group-hover:border-foreground transition-colors">
								Discover More
							</span>
						</div>
					</div>
				</YnsLink>

				<YnsLink prefetch={"eager"} href="#products" className="group block">
					<div
						className="relative overflow-hidden p-8 sm:p-12 min-h-[280px] flex flex-col justify-end"
						style={{
							background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #333 100%)",
						}}
					>
						<div className="absolute top-6 left-8 sm:top-8 sm:left-12">
							<p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Discover Them All</p>
						</div>
						<div>
							<h3 className="font-heading text-2xl sm:text-3xl font-light text-white leading-tight">
								{"THIS SEASON'S"}
								<br />
								<span className="font-semibold">BOMBER JACKETS</span>
							</h3>
							<span className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-white/70 border-b border-white/30 pb-0.5 group-hover:border-white transition-colors">
								Discover More
							</span>
						</div>
					</div>
				</YnsLink>
			</div>
		</section>
	);
}
