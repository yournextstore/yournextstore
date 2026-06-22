import { ArrowRightIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const features = [
	"Nitrogen-Infused Brews",
	"Variety of Bold Flavors",
	"Ultimate Refreshment",
	"Low-Calorie, All-Day",
];

export function Hero() {
	return (
		<section className="yns-hero-surface yns-noise relative isolate overflow-hidden pt-24 pb-32 sm:pt-28 sm:pb-40">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.18),transparent_55%)]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black to-transparent"
			/>

			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Floating tag */}
				<div className="flex justify-center">
					<div className="yns-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/70">
						<span className="h-1.5 w-1.5 rounded-full bg-[var(--color-yns-yellow)] shadow-[0_0_8px_var(--color-yns-yellow)]" />
						Nitro-Infused · Drop 04
					</div>
				</div>

				{/* Headline */}
				<div className="mt-6 text-center">
					<h1 className="font-display text-[10vw] sm:text-7xl lg:text-8xl leading-[0.95] text-white">
						<span className="block">Welcome to YNS —</span>
						<span className="block text-white/95">
							Your <span className="text-[var(--color-yns-yellow)]">Cool Drink</span> Haven
						</span>
					</h1>
					<p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl mx-auto">
						Elevate Your Refreshment Game <span className="mx-2 text-white/30">|</span> Explore Cool Drink
						Delights
					</p>
				</div>

				{/* CTAs */}
				<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-white text-black rounded-full text-sm font-semibold tracking-wide hover:bg-[var(--color-yns-yellow)] transition-colors"
					>
						Order Now
						<ArrowRightIcon className="h-4 w-4" />
					</YnsLink>
					<YnsLink
						prefetch={"eager"}
						href="#about"
						className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors group"
					>
						Learn more
						<span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 group-hover:border-white/60 group-hover:bg-white/5 transition-colors">
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</span>
					</YnsLink>
				</div>

				{/* Hero visual area */}
				<div className="relative mt-16 sm:mt-20">
					{/* Feature bullets - left */}
					<div className="absolute top-0 left-0 hidden lg:block max-w-[210px]">
						<p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Our key feature</p>
						<ul className="space-y-2.5 text-sm text-white/85">
							{features.map((f) => (
								<li key={f} className="flex items-start gap-2.5">
									<span className="mt-2 h-1 w-1 rounded-full bg-[var(--color-yns-yellow)]" />
									<span>{f}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Product callout - top right */}
					<div className="absolute top-0 right-0 hidden lg:block w-[210px]">
						<div className="yns-card-glass relative rounded-2xl p-3 pr-4">
							<div className="flex items-center gap-3">
								<div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-black/60">
									<Image
										src="/scraped-1.jpg"
										alt="Featured drink"
										fill
										sizes="48px"
										className="object-cover"
									/>
								</div>
								<div>
									<p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Featured</p>
									<p className="text-xs text-white/80 mt-0.5">See our best flavors</p>
								</div>
							</div>
							<div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-[var(--color-yns-yellow)] flex items-center justify-center text-black text-xs">
								<ArrowRightIcon className="h-3.5 w-3.5 -rotate-45" strokeWidth={3} />
							</div>
						</div>
					</div>

					{/* Hero image — two cans */}
					<div className="relative mx-auto aspect-[16/10] max-w-3xl">
						<div
							aria-hidden="true"
							className="absolute inset-x-12 bottom-2 h-12 rounded-[50%] bg-[var(--color-yns-yellow)]/20 blur-2xl"
						/>
						<Image
							src="/scraped-0.jpg"
							alt=""
							aria-hidden="true"
							fill
							priority
							sizes="(max-width: 768px) 100vw, 800px"
							className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
						/>
					</div>

					{/* Floating social proof */}
					<div className="mt-6 lg:absolute lg:mt-0 lg:bottom-6 lg:left-0 flex justify-center lg:justify-start">
						<div className="yns-card-glass flex items-center gap-3 rounded-2xl px-3 py-2.5 max-w-[200px]">
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-yns-yellow)] text-black">
								<PlayIcon className="h-4 w-4 fill-current" />
							</div>
							<div className="text-[11px] leading-tight text-white/70">
								<p>Our All YNS</p>
								<p>Products for</p>
								<p className="text-white font-semibold">100% Healthy</p>
							</div>
						</div>
					</div>

					<div className="mt-4 lg:mt-0 lg:absolute lg:bottom-6 lg:right-0 flex justify-center lg:justify-end">
						<div className="yns-card-glass flex items-center gap-3 rounded-full pl-2 pr-4 py-1.5">
							<div className="flex -space-x-2">
								{[
									"bg-gradient-to-br from-zinc-300 to-zinc-500",
									"bg-gradient-to-br from-amber-200 to-amber-500",
									"bg-gradient-to-br from-zinc-500 to-zinc-700",
								].map((cls, i) => (
									<span
										key={cls}
										className={`h-7 w-7 rounded-full border-2 border-black ${cls}`}
										style={{ zIndex: 3 - i }}
									/>
								))}
							</div>
							<div className="text-xs">
								<p className="text-white font-bold leading-none">19K+</p>
								<p className="text-white/60 leading-tight">Reviews</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
