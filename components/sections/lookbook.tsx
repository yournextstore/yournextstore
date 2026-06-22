import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Lookbook() {
	return (
		<section className="relative bg-background py-20 sm:py-28 overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-6">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/70 mb-3">
							[ 002 — campaign ]
						</p>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
							Field study, 06:14
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-flex items-center text-[11px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:text-cyan-200 transition-colors"
					>
						[ Read more → ]
					</YnsLink>
				</div>

				<div className="relative rounded-3xl overflow-hidden border border-border">
					<div className="relative aspect-[21/9] sm:aspect-[21/8]">
						<Image
							src="/scraped-5.jpg"
							alt="Drop 003 campaign tableau"
							fill
							sizes="(max-width: 1400px) 100vw, 1400px"
							className="object-cover"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(90deg, rgba(6,26,38,0.85) 0%, rgba(6,26,38,0.2) 40%, transparent 70%)",
							}}
						/>
						<div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
							<div className="flex items-start justify-between">
								<span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/60">
									[ chapter 03 / vapor ]
								</span>
								<span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/60 hidden sm:inline">
									[ NZ — south island ]
								</span>
							</div>
							<div className="max-w-md">
								<h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-tight">
									A wardrobe for the in-between hours — when light forgets which way it's going.
								</h3>
								<p className="mt-4 text-sm text-foreground/70 max-w-sm">
									Shot in the brackish pre-dawn off the Tasman coast. Fabrics tested at 2°C and rising sea
									spray.
								</p>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] text-cyan-200 hover:text-cyan-100 transition-colors"
								>
									[ explore drop 003 → ]
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
