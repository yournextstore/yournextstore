import { ArrowUpRightIcon, LeafIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
				<div className="hero-noise relative overflow-hidden rounded-[28px] hero-forest hero-leaf-pattern">
					{/* Decorative leaf SVGs */}
					<svg
						aria-hidden="true"
						viewBox="0 0 600 600"
						className="absolute -left-20 -top-20 w-[420px] opacity-25 text-leaf-300"
						fill="currentColor"
					>
						<path d="M300 30c-110 0-200 90-200 200 0 70 36 132 91 167-26-50-36-104-25-160 17-87 87-157 174-174 56-11 110-1 160 25-35-55-97-91-167-91h-33z" />
					</svg>
					<svg
						aria-hidden="true"
						viewBox="0 0 600 600"
						className="absolute right-[-60px] bottom-[-80px] w-[360px] opacity-20 rotate-180 text-leaf-200"
						fill="currentColor"
					>
						<path d="M300 30c-110 0-200 90-200 200 0 70 36 132 91 167-26-50-36-104-25-160 17-87 87-157 174-174 56-11 110-1 160 25-35-55-97-91-167-91h-33z" />
					</svg>

					<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 p-6 sm:p-10 lg:p-14">
						{/* LEFT */}
						<div className="lg:col-span-7 flex flex-col justify-between min-h-[520px] sm:min-h-[600px] text-leaf-50">
							<div>
								<div className="inline-flex items-center gap-2 rounded-full bg-leaf-50/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium ring-1 ring-leaf-50/20">
									<span className="relative flex h-1.5 w-1.5">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-300/70" />
										<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-leaf-300" />
									</span>
									New · Botanica wellness collection
								</div>

								<h1 className="mt-8 font-display text-balance text-[3rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.95] tracking-tight">
									The Power <span className="italic font-light text-leaf-200">of</span>{" "}
									<br className="hidden sm:block" />
									Nature in Every <span className="italic font-light text-leaf-200">Capsule</span>
								</h1>

								<p className="mt-8 max-w-md text-base sm:text-lg leading-relaxed text-leaf-50/75">
									Pure, plant-powered essentials thoughtfully formulated to support your daily rituals — from
									calm mornings to restful evenings.
								</p>
							</div>

							<div className="mt-10 flex flex-wrap items-center gap-4">
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="group inline-flex items-center gap-2 h-12 px-7 bg-leaf-50 text-[#0f2412] rounded-full text-sm font-semibold hover:bg-white transition-all"
								>
									Explore Now
									<span className="grid place-items-center h-7 w-7 rounded-full bg-[#0f2412] text-leaf-50 group-hover:rotate-45 transition-transform">
										<ArrowUpRightIcon className="h-3.5 w-3.5" />
									</span>
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-sm font-medium text-leaf-50 ring-1 ring-leaf-50/30 hover:bg-leaf-50/10 transition-colors"
								>
									Our Story
								</YnsLink>
							</div>

							{/* trust badges */}
							<div className="mt-12 flex flex-col sm:flex-row gap-6 sm:gap-10 text-xs text-leaf-50/70">
								<div className="flex items-center gap-2">
									<LeafIcon className="h-4 w-4 text-leaf-300" />
									<span>100% Organic Botanicals</span>
								</div>
								<div className="flex items-center gap-2">
									<ShieldCheckIcon className="h-4 w-4 text-leaf-300" />
									<span>Third-Party Lab Tested</span>
								</div>
								<div className="flex items-center gap-2">
									<SparklesIcon className="h-4 w-4 text-leaf-300" />
									<span>Vegan & Cruelty Free</span>
								</div>
							</div>
						</div>

						{/* RIGHT */}
						<div className="lg:col-span-5 relative">
							<div className="relative rounded-[24px] overflow-hidden h-[440px] sm:h-[560px] lg:h-full ring-1 ring-leaf-50/15">
								<Image
									src="/scraped-0.jpg"
									alt="Wellness product still life"
									fill
									priority
									sizes="(max-width: 1024px) 100vw, 40vw"
									className="object-cover scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#0f2412]/70 via-transparent to-transparent" />

								{/* floating product chip */}
								<div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-leaf-50/90 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-[#0f2412]">
									<span className="h-2 w-2 rounded-full bg-emerald-500" />
									In stock · Ships in 24h
								</div>

								{/* floating info card */}
								<div className="absolute right-4 bottom-4 lg:right-5 lg:bottom-5 w-[88%] sm:w-72 rounded-2xl bg-leaf-50/95 backdrop-blur-md p-4 shadow-xl">
									<div className="flex items-start gap-3">
										<div className="grid place-items-center h-9 w-9 rounded-full bg-[#0f2412] text-leaf-50 shrink-0">
											<LeafIcon className="h-4 w-4" />
										</div>
										<div>
											<p className="text-[11px] uppercase tracking-wider text-leaf-700 font-semibold">
												Daily Wellness
											</p>
											<p className="mt-1 text-sm text-[#0f2412] font-medium leading-snug">
												Adaptogenic blends crafted from 27 single-origin herbs.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom band — testimonial / social proof */}
					<div className="relative border-t border-leaf-50/15 bg-[#0a1d0d]/70 backdrop-blur-md">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 sm:px-10 lg:px-14 py-6">
							<div className="flex items-center gap-4">
								<div className="flex -space-x-2">
									{["#a8c190", "#cfdcc1", "#5b7a3a", "#e7eede1"].map((c, i) => (
										<span
											key={c}
											className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0a1d0d]"
											style={{
												background: `linear-gradient(135deg, ${c} 0%, #0f2412 120%)`,
												zIndex: 10 - i,
											}}
										/>
									))}
									<span className="grid place-items-center h-9 w-9 rounded-full bg-leaf-50 text-[#0f2412] text-[11px] font-bold ring-2 ring-[#0a1d0d]">
										+8K
									</span>
								</div>
								<p className="text-sm text-leaf-50/80">
									<span className="font-medium text-leaf-50">Start your personalized path</span> to natural
									balance
								</p>
							</div>

							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2">
									<div className="flex">
										{Array.from({ length: 5 }).map((_, i) => (
											<svg
												key={`star-${i}`}
												viewBox="0 0 20 20"
												className="h-4 w-4 text-leaf-300"
												fill="currentColor"
											>
												<path d="M10 1l2.6 6.1 6.4.6-4.9 4.4 1.5 6.4L10 15.3 4.4 18.5 5.9 12 1 7.7l6.4-.6L10 1z" />
											</svg>
										))}
									</div>
									<span className="text-xs text-leaf-50/75">4.9 · 8,420 reviews</span>
								</div>
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-leaf-50 hover:text-leaf-300 transition-colors"
								>
									Personalize my routine →
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
