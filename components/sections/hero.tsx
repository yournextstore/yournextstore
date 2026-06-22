import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full">
			<div className="relative mx-auto max-w-[1400px]">
				<div className="relative h-[460px] sm:h-[540px] lg:h-[600px] overflow-hidden">
					{/* Cinematic mushroom-gummy backdrop */}
					<Image
						src="/scraped-0.jpg"
						alt="Functional mushroom gummies surrounded by lion's mane and cordyceps"
						fill
						priority
						sizes="100vw"
						className="object-cover object-center"
					/>
					{/* Painterly warm overlay matching the reference's amber/cobalt-on-bark feel */}
					<div
						aria-hidden="true"
						className="absolute inset-0"
						style={{
							background:
								"linear-gradient(90deg, rgba(58, 44, 34, 0.72) 0%, rgba(58, 44, 34, 0.35) 40%, rgba(58, 44, 34, 0.1) 65%, rgba(58, 44, 34, 0.2) 100%)",
						}}
					/>

					<div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center">
						<div className="max-w-xl text-white">
							<p className="font-label text-white/75 mb-5">YOUR NEXT STORE — LONGEVITY SERIES</p>
							<h1 className="font-editorial text-[42px] leading-[1.05] sm:text-6xl lg:text-[68px] lg:leading-[1.02] font-medium tracking-tight">
								Support your nervous system
							</h1>
							<p className="mt-5 text-base sm:text-lg text-white/85 max-w-md leading-relaxed">
								Functional mushroom gummies, designed to be taken daily.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-3">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="btn-cobalt inline-flex items-center justify-center h-11 px-7 rounded-[6px] text-[14px] font-medium tracking-wide"
								>
									Shop Mushroom Gummies
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="#ingredients"
									className="inline-flex items-center justify-center h-11 px-5 rounded-[6px] text-[14px] font-medium text-white/90 hover:text-white border border-white/25 hover:border-white/50 transition-colors"
								>
									Why mushrooms?
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
