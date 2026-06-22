import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-[calc(100vh-104px)] min-h-[640px] max-h-[860px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt="A bottle of Your Next Store spring water held above a glassy alpine lake"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div
					aria-hidden
					className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35"
				/>
				<div
					aria-hidden
					className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent"
				/>

				<div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
					<h1 className="font-display text-white text-[44px] sm:text-6xl lg:text-[88px] leading-[1.02] tracking-tight max-w-5xl drop-shadow-[0_2px_30px_rgba(0,0,0,0.35)]">
						<span className="italic">Perfectly pure</span> water.
					</h1>
					<p className="mt-7 text-white/90 text-base sm:text-lg font-sans tracking-wide max-w-xl">
						All of the minerals, none of the chemicals.
					</p>
					<div className="mt-10">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-9 rounded-full bg-yns-green text-white text-[13px] tracking-[0.16em] uppercase font-medium hover:bg-[#1e3f27] transition-colors shadow-[0_8px_24px_rgba(31,42,46,0.35)]"
						>
							Take a Sip
						</YnsLink>
					</div>
				</div>

				<div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-white/85">
					<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
						<title>Scroll indicator</title>
						<path d="M6 14C12 18 18 22 30 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</div>
			</div>
		</section>
	);
}
