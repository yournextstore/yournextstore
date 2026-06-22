import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-background pb-0">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 sm:pt-6">
				<h1 aria-label="Your Next Store" className="yns-wordmark text-foreground select-none">
					<span className="block text-[22vw] sm:text-[20vw] lg:text-[18.5vw]">YOUR NEXT</span>
					<span className="block text-[22vw] sm:text-[20vw] lg:text-[18.5vw] -mt-[2vw]">
						STORE<span className="text-[color:var(--yns-terracotta)]">.</span>
					</span>
				</h1>
			</div>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-12 sm:pb-20">
				<div className="relative mt-2 overflow-hidden rounded-md">
					<div className="relative aspect-[16/9] sm:aspect-[16/8] lg:aspect-[21/9]">
						<Image
							src="/scraped-0.jpg"
							alt="Editorial still life of handcrafted wooden objects"
							fill
							priority
							sizes="(max-width: 1400px) 100vw, 1400px"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

						<YnsLink
							prefetch="eager"
							href="/products"
							className="group absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--yns-cream)] px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-foreground shadow-[0_2px_20px_rgba(27,28,31,0.08)] transition-all hover:bg-white hover:shadow-[0_4px_28px_rgba(27,28,31,0.15)]"
						>
							Catalogue
							<span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
						</YnsLink>

						<div
							aria-hidden="true"
							className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--yns-ink)] text-[color:var(--yns-cream)] text-xs"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Scroll</title>
								<path d="M12 5v14" />
								<path d="m19 12-7 7-7-7" />
							</svg>
						</div>
					</div>
				</div>

				<div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-10 items-end">
					<div className="sm:col-span-7 lg:col-span-6">
						<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">A studio of objects</p>
						<p className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.15] text-foreground">
							Sculptural toys, building blocks and design objects — made by hand, kept for generations.
						</p>
					</div>
					<div className="sm:col-span-5 lg:col-start-9 lg:col-span-4">
						<p className="text-[15px] leading-relaxed text-muted-foreground">
							Your Next Store is a small workshop of woodworkers, painters and parents. Every piece is
							finished by hand in matte plant-based pigments, then signed before it leaves the bench.
						</p>
						<YnsLink
							prefetch="eager"
							href="/products"
							className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground border-b border-foreground/30 hover:border-foreground transition-colors pb-1"
						>
							Browse the full catalogue
							<span>→</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
