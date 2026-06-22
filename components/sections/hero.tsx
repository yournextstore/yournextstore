import { ArrowRightIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
				<div className="relative rounded-[2rem] overflow-hidden bg-brand-gradient text-brand-foreground shadow-[0_30px_80px_-30px_rgba(14,79,63,0.55)]">
					{/* Decorative SVG layers */}
					<svg
						aria-hidden="true"
						viewBox="0 0 800 600"
						className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-screen"
						preserveAspectRatio="xMidYMid slice"
					>
						<defs>
							<radialGradient id="hero-glow" cx="80%" cy="20%" r="60%">
								<stop offset="0%" stopColor="#d4c5a9" stopOpacity="0.8" />
								<stop offset="100%" stopColor="#0e4f3f" stopOpacity="0" />
							</radialGradient>
							<pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
								<circle cx="2" cy="2" r="1" fill="#f5efe6" fillOpacity="0.35" />
							</pattern>
						</defs>
						<rect width="800" height="600" fill="url(#hero-glow)" />
						<rect width="800" height="600" fill="url(#dots)" />
					</svg>

					<div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cream/10 blur-3xl" />
					<div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sand/20 blur-3xl" />

					<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 sm:px-10 lg:px-16 pt-12 lg:pt-20 pb-14 lg:pb-20">
						{/* Left: Headline + copy */}
						<div className="lg:col-span-7 max-w-2xl">
							<p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/80">
								<span className="h-px w-8 bg-cream/60" />
								Codoc · Curated Baby Shop
							</p>
							<h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.95] tracking-tight text-cream">
								The Baby
								<br />
								<span className="italic text-sand">Shop</span>
							</h1>
							<p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-cream/75">
								Everything you need, from A to Zzz. Thoughtfully sourced essentials for little ones — soft on
								skin, gentle on the planet, made to last beyond the early years.
							</p>

							<div className="mt-10 flex flex-wrap items-center gap-4">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-cream text-brand rounded-full text-sm font-semibold hover:bg-white transition-colors"
								>
									Shop Now
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
								<button
									type="button"
									className="inline-flex items-center gap-3 text-sm font-medium text-cream/90 hover:text-cream transition-colors"
								>
									<span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 bg-cream/5 backdrop-blur-sm">
										<PlayIcon className="h-3.5 w-3.5 fill-current" />
									</span>
									Watch the story
								</button>
							</div>
						</div>

						{/* Right: Floating cards */}
						<div className="lg:col-span-5 relative min-h-[360px] lg:min-h-[480px]">
							{/* Stat card */}
							<div className="absolute -top-2 right-2 sm:right-6 lg:right-0 z-20">
								<div className="rounded-2xl bg-cream/95 backdrop-blur px-5 py-4 shadow-xl shadow-black/20 text-brand">
									<p className="font-display text-3xl leading-none">1200+</p>
									<p className="mt-1 text-[10px] uppercase tracking-widest text-brand/60">
										Baby Powerful
										<br />
										Products
									</p>
								</div>
							</div>

							{/* Product image card */}
							<div className="absolute right-0 top-16 lg:top-20 z-10 w-[88%] sm:w-[78%]">
								<div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-sand/30 shadow-2xl shadow-black/30">
									<Image
										src="/scraped-2.jpg"
										alt="Featured product"
										fill
										className="object-cover"
										sizes="(max-width: 768px) 90vw, 400px"
										priority
									/>
								</div>
							</div>

							{/* Small accent card */}
							<div className="absolute -bottom-2 left-2 sm:left-6 lg:left-0 z-20 hidden sm:block">
								<div className="rounded-2xl bg-sand/95 px-4 py-3 shadow-xl shadow-black/20 text-brand max-w-[200px]">
									<p className="text-[10px] uppercase tracking-widest text-brand/70">Best Seller</p>
									<p className="mt-1 font-display text-base leading-tight">Baby head protector</p>
								</div>
							</div>

							{/* Decorative checker pattern */}
							<div className="absolute top-2 right-32 lg:right-40 z-0 grid grid-cols-4 gap-1 opacity-60">
								{Array.from({ length: 16 }).map((_, i) => (
									<div
										key={`check-${i}`}
										className={`h-2 w-2 ${i % 2 === 0 ? "bg-sand" : "bg-transparent"}`}
									/>
								))}
							</div>
						</div>
					</div>

					{/* Bottom stat bar inside hero */}
					<div className="relative border-t border-cream/15 px-6 sm:px-10 lg:px-16 py-6 grid grid-cols-3 gap-4 text-cream">
						{[
							{ value: "12", label: "Years of Trust" },
							{ value: "150+", label: "Brand Partners Worldwide" },
							{ value: "1K+", label: "Products" },
						].map((stat) => (
							<div key={stat.label} className="text-center sm:text-left">
								<p className="font-display text-2xl sm:text-3xl">{stat.value}</p>
								<p className="mt-0.5 text-[10px] sm:text-xs uppercase tracking-widest text-cream/60">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
