import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-background pt-4 sm:pt-6 pb-16 sm:pb-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-yns-lavender/60 yns-grain">
					{/* Hero photo */}
					<div className="relative aspect-[16/9] sm:aspect-[16/8] w-full">
						<Image
							src="/scraped-0.jpg"
							alt="Three models holding pastel YNS haircare bottles in an editorial salon shot"
							fill
							priority
							sizes="(max-width: 1280px) 100vw, 1200px"
							className="object-cover"
						/>
						{/* Soft gradient veil for legibility */}
						<div
							aria-hidden="true"
							className="absolute inset-0"
							style={{
								background: "linear-gradient(180deg, rgba(245,239,231,0) 55%, rgba(27,27,27,0.35) 100%)",
							}}
						/>
						{/* Bottom-left overlay text */}
						<div className="absolute left-6 sm:left-10 bottom-8 sm:bottom-12 text-yns-cream max-w-[40%]">
							<p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase">
								Welcome to YNS Verse
							</p>
						</div>
						{/* Bottom-right overlay text */}
						<div className="absolute right-6 sm:right-10 bottom-8 sm:bottom-12 text-yns-cream max-w-[42%] text-right">
							<p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase">
								We Bottled The Salon
							</p>
							<p className="mt-2 text-[11px] sm:text-[13px] leading-snug text-yns-cream/85 font-light">
								A premium haircare system <em className="not-italic font-medium italic">expertly</em>{" "}
								formulated to give you big results and a bigger sense of confidence.
							</p>
						</div>
					</div>
					{/* Floating gradient pill CTA */}
					<div className="absolute left-1/2 -bottom-6 -translate-x-1/2">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="yns-pill-cta inline-flex items-center justify-center h-12 px-10 rounded-full text-[12px] font-bold tracking-[0.24em] uppercase transition-all duration-300 hover:scale-[1.02]"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
