import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="yns-hero-gradient relative">
				<div className="absolute inset-0 yns-floor-tint pointer-events-none" aria-hidden="true" />
				<div
					aria-hidden="true"
					className="absolute inset-x-0 top-[58%] h-px bg-white/15 origin-left"
					style={{ transform: "rotate(-3deg)" }}
				/>
				<div className="relative max-w-7xl mx-auto px-6 lg:px-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4 py-20 lg:py-28">
						<div className="lg:col-span-6 relative z-10">
							<h1 className="font-serif font-light text-white text-[44px] sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
								A better way
								<br />
								to drink tea
							</h1>
							<p className="mt-8 text-white/85 text-sm tracking-wide">Loose leaf tea. Never bags.</p>
							<div className="mt-10">
								<YnsLink
									prefetch={"eager"}
									href="#tea-club"
									className="inline-flex items-center justify-center h-11 px-7 bg-[color:var(--color-yns-navy)] text-white text-[13px] tracking-[0.16em] rounded-[2px] hover:bg-[color:var(--color-yns-navy-deep)] transition-colors"
								>
									Join the Tea Club
								</YnsLink>
							</div>
						</div>
						<div className="lg:col-span-6 relative h-[320px] sm:h-[420px] lg:h-[520px]">
							<Image
								src="/scraped-0.jpg"
								alt="Loose leaf tea cans and pouches"
								fill
								priority
								className="object-contain object-right-bottom select-none"
								sizes="(max-width: 1024px) 90vw, 50vw"
							/>
							<HeroPill className="bottom-14 right-2 sm:right-12">Free Brewing Kit</HeroPill>
							<HeroPill className="bottom-36 left-2 sm:left-6">Whole leaves. Full flavour</HeroPill>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function HeroPill({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={`absolute z-20 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-4 py-1.5 text-[11px] font-medium tracking-wide text-[color:var(--color-yns-navy)] shadow-sm ${className ?? ""}`}
		>
			<span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-yns-navy)] text-white">
				<svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<title>checkmark</title>
					<path
						d="M3 8.5l3.2 3.2L13 4.8"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
			{children}
		</div>
	);
}
