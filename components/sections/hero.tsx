import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#1F2A33] text-[#F5EFE6]">
			<div className="absolute inset-0">
				<Image src="/scraped-3.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-90" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#1F2A33]/85 via-[#1F2A33]/55 to-[#1F2A33]/30" />
				<div className="absolute inset-0 bg-gradient-to-b from-[#1F2A33]/30 via-transparent to-[#8FB1C7]/20" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-16 sm:pt-24 pb-40 sm:pb-56 lg:pb-72 min-h-[640px] sm:min-h-[760px] flex flex-col justify-center">
					<div className="max-w-2xl">
						<h1 className="headline-display text-[#F5EFE6] text-4xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[0.92]">
							The laundry
							<br />
							detergent
							<br />
							you&apos;ve been
							<br />
							wishing for
						</h1>
						<ul className="mt-10 space-y-1.5 text-lg sm:text-xl font-medium text-[#F5EFE6]/95">
							<li>Good For You</li>
							<li>Good For Your Clothes</li>
							<li>Good For The Planet</li>
						</ul>
						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-10 bg-[#F5EFE6] text-[#1F2A33] rounded-full text-sm uppercase tracking-[0.18em] font-semibold hover:bg-white transition-colors shadow-lg shadow-[#1F2A33]/20"
							>
								Shop Now
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Floating product hint on right side, larger screens only */}
			<div className="absolute right-4 lg:right-16 bottom-32 lg:bottom-40 hidden md:block pointer-events-none">
				<div className="relative w-44 lg:w-64 aspect-[3/4] yns-float">
					<Image
						src="/scraped-0.jpg"
						alt=""
						fill
						sizes="(max-width: 1024px) 200px, 280px"
						className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)]"
					/>
				</div>
			</div>

			{/* Wavy water-shaped divider into the blue band */}
			<svg
				className="absolute -bottom-px left-0 w-full h-16 sm:h-24"
				viewBox="0 0 1440 120"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path
					d="M0,80 C180,20 360,120 540,80 C720,40 900,100 1080,70 C1260,40 1380,90 1440,60 L1440,120 L0,120 Z"
					fill="#8FB1C7"
				/>
			</svg>
		</section>
	);
}
