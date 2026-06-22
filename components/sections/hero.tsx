import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* LEFT: mustard panel */}
				<div className="relative bg-hero-mustard overflow-hidden">
					<div className="absolute inset-0 bg-confetti opacity-70 pointer-events-none" />
					{/* Decorative blob */}
					<svg
						aria-hidden="true"
						viewBox="0 0 200 200"
						className="absolute -top-6 -left-10 h-44 w-44 text-white/40"
					>
						<title>decorative blob</title>
						<path
							fill="currentColor"
							d="M48.2,-58.7C61.2,-50.6,69.4,-34.1,71.3,-17.4C73.2,-0.6,68.8,16.4,59.4,29.2C50,42,35.6,50.6,20.3,57.4C5,64.2,-11.2,69.1,-25,64.6C-38.8,60.1,-50.2,46.1,-57.5,30.9C-64.8,15.6,-67.9,-0.9,-63.4,-15C-58.9,-29.1,-46.7,-40.7,-33.5,-49.1C-20.2,-57.4,-5.8,-62.5,8.7,-63.5C23.2,-64.5,46.4,-61.4,48.2,-58.7Z"
							transform="translate(100 100)"
						/>
					</svg>
					<svg
						aria-hidden="true"
						viewBox="0 0 200 200"
						className="absolute bottom-6 right-4 h-28 w-28 text-brand-coral/60"
					>
						<title>decorative cookie</title>
						<circle cx="100" cy="100" r="78" fill="currentColor" />
						<circle cx="80" cy="80" r="8" fill="#1f1f1f" opacity="0.35" />
						<circle cx="120" cy="95" r="6" fill="#1f1f1f" opacity="0.35" />
						<circle cx="105" cy="130" r="9" fill="#1f1f1f" opacity="0.35" />
						<circle cx="70" cy="120" r="5" fill="#1f1f1f" opacity="0.35" />
					</svg>

					<div className="relative px-6 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-28 flex flex-col justify-center min-h-[420px] lg:min-h-[640px]">
						<span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
							<span className="h-1.5 w-1.5 rounded-full bg-brand-coral" /> New Drop
						</span>
						<h1 className="mt-5 font-display text-[44px] sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-brand-ink">
							Dessert Snacks
							<br />
							<span className="italic text-brand-coral">With</span> Functionality
						</h1>
						<p className="mt-6 max-w-md text-base sm:text-lg text-brand-ink/80 leading-relaxed">
							A revolutionary superfood snack bite inspired by global cultures and packed with nostalgia —
							every bite a treat that fuels you back to yourself.
						</p>
						<div className="mt-9 flex flex-wrap items-center gap-3">
							<YnsLink prefetch={"eager"} href="/products" className="btn-pill bg-brand-ink text-white">
								Shop Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="btn-pill bg-white/80 text-brand-ink backdrop-blur"
							>
								See the flavors
							</YnsLink>
						</div>
					</div>
				</div>

				{/* RIGHT: photo-collage panel */}
				<div className="relative min-h-[420px] lg:min-h-[640px] overflow-hidden bg-brand-green">
					<Image
						src="/scraped-0.jpg"
						alt="Snack bites surrounded by berries and chocolate"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					{/* Gradient wash to tie in palette */}
					<div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-tr from-brand-coral/30 via-transparent to-brand-green/20 mix-blend-multiply"
					/>
					{/* Layered floating sticker */}
					<div className="absolute top-6 left-6 hidden sm:block">
						<div className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-ink shadow-md">
							Snack <span className="text-brand-coral">Bites</span>
						</div>
					</div>
					<div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 rounded-full bg-brand-ink/85 backdrop-blur px-4 py-2 text-[12px] font-medium text-white">
						<span className="h-2 w-2 rounded-full bg-brand-mustard" />3 new flavors live
					</div>
				</div>
			</div>
		</section>
	);
}
