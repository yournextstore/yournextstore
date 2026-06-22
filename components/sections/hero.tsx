import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-cream overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
				<p className="text-sm text-forest/70 mb-4 font-medium">
					<span className="text-forest-deep/50">All category /</span>{" "}
					<span className="text-forest-deep font-semibold">Fresh organics</span>
				</p>

				<div className="relative rounded-[2rem] overflow-hidden bg-forest-grain min-h-[480px] lg:min-h-[560px]">
					{/* Decorative SVG leaf pattern */}
					<svg
						className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
						viewBox="0 0 800 600"
						fill="none"
						aria-hidden="true"
						preserveAspectRatio="xMidYMid slice"
					>
						<title>leaf pattern</title>
						<path
							d="M-100 600C-100 600 100 200 400 300C600 380 700 200 900 100"
							stroke="#C6F26D"
							strokeWidth="2"
							strokeDasharray="6 8"
							opacity="0.4"
						/>
						<circle cx="650" cy="120" r="180" fill="#1B5E47" opacity="0.4" />
						<circle cx="100" cy="500" r="120" fill="#C6F26D" opacity="0.15" />
					</svg>

					<div className="relative grid lg:grid-cols-2 gap-8 px-6 sm:px-12 lg:px-16 py-12 lg:py-20">
						{/* Left: Copy */}
						<div className="flex flex-col justify-center text-cream">
							<span className="inline-flex items-center gap-2 self-start rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 px-3 py-1 text-xs font-medium text-cream">
								<span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
								Now delivering in your zip
							</span>
							<h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
								Farm-fresh groceries, picked at peak ripeness
							</h1>
							<p className="mt-5 text-base sm:text-lg text-cream/70 leading-relaxed max-w-md">
								Organic produce, pantry staples and artisan goods — sourced from local growers and at your
								door within an hour.
							</p>

							<div className="mt-8 flex flex-wrap gap-3">
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="inline-flex items-center gap-2 h-12 px-6 bg-lime text-forest-deep rounded-full text-sm font-semibold hover:bg-lime/90 transition-colors shadow-[0_8px_24px_-8px_rgba(198,242,109,0.6)]"
								>
									Shop fresh now
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center gap-2 h-12 px-6 border border-cream/30 text-cream rounded-full text-sm font-semibold hover:bg-cream/10 transition-colors"
								>
									Browse pantry
								</YnsLink>
							</div>

							{/* Trust strip */}
							<div className="mt-10 flex flex-wrap gap-6 text-cream/80 text-xs">
								<div className="flex items-center gap-2">
									<span className="h-7 w-7 rounded-full bg-lime/20 text-lime flex items-center justify-center text-sm">
										✓
									</span>
									<span>USDA certified organic</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="h-7 w-7 rounded-full bg-lime/20 text-lime flex items-center justify-center text-sm">
										⚡
									</span>
									<span>30-minute delivery</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="h-7 w-7 rounded-full bg-lime/20 text-lime flex items-center justify-center text-sm">
										♻
									</span>
									<span>Zero-waste packaging</span>
								</div>
							</div>
						</div>

						{/* Right: Image card */}
						<div className="relative hidden lg:block">
							<div className="absolute -top-4 -right-4 z-10 flex items-center gap-2 rounded-full bg-cream text-forest-deep px-4 py-2 shadow-xl">
								<span className="h-2 w-2 rounded-full bg-lime" />
								<span className="text-xs font-semibold">Free Delivery over $100</span>
							</div>
							<div className="relative h-full min-h-[420px] rounded-[1.5rem] overflow-hidden bg-cream/10">
								<Image
									src="/scraped-0.jpg"
									alt="Fresh organic groceries"
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
							</div>
							{/* Floating price tag */}
							<div className="absolute bottom-6 left-6 rounded-2xl bg-cream/95 backdrop-blur px-4 py-3 shadow-2xl">
								<p className="text-[10px] uppercase tracking-wider text-forest-deep/60">Today's pick</p>
								<p className="text-sm font-display font-semibold text-forest-deep">
									Organic Heirloom Tomatoes
								</p>
								<p className="text-xs text-forest mt-0.5">
									From <span className="font-bold">$4.20</span> / lb
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Category pills row */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
				<div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
					{[
						{ label: "Fresh produce", icon: "🥬" },
						{ label: "Bakery", icon: "🥖" },
						{ label: "Dairy & eggs", icon: "🥚" },
						{ label: "Pantry staples", icon: "🌾" },
						{ label: "Beverages", icon: "🥤" },
						{ label: "Snacks", icon: "🍿" },
						{ label: "Frozen", icon: "🧊" },
						{ label: "Wellness", icon: "🌿" },
					].map((cat) => (
						<button
							type="button"
							key={cat.label}
							className="shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-cream border border-border hover:border-forest hover:bg-forest hover:text-cream transition-all text-sm font-medium text-forest-deep"
						>
							<span className="text-base">{cat.icon}</span>
							{cat.label}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}
