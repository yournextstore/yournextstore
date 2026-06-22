import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-arame-hero min-h-[88vh]">
			{/* Centered hero still life — use scraped imagery as the focal element */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="relative h-[110%] w-[78%] max-w-[1100px]">
					<Image
						src="/scraped-0.jpg"
						alt=""
						fill
						priority
						sizes="(max-width: 768px) 100vw, 1100px"
						className="object-contain object-center mix-blend-multiply opacity-95"
					/>
				</div>
			</div>

			{/* Soft vignette */}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(45,38,22,0.18)_100%)]"
			/>

			{/* Left-aligned editorial copy */}
			<div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 min-h-[88vh] flex items-center">
				<div className="max-w-[560px] text-bone">
					<h1 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] leading-[0.95] tracking-tight">
						A ritual she deserves.
					</h1>
					<p className="mt-6 text-[11px] tracking-arame uppercase font-medium text-bone/85">
						This Mother&apos;s Day, save 15% on the Toothpaste &amp; Whiten Duo.
					</p>
					<p className="mt-2 font-serif italic text-base text-bone/75">Offer ends May 10.</p>
					<div className="mt-9">
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-flex items-center justify-center h-12 px-12 rounded-full bg-bone text-cocoa text-[11px] tracking-arame uppercase font-medium hover:bg-cream transition-colors shadow-sm"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
			</div>

			{/* Scroll cue */}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bone/70">
				<span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
					<path d="M12 4v16M5 13l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</section>
	);
}
