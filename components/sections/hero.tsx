import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-background pt-12 pb-0 sm:pt-20">
			<div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
				<p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
					<span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
					Cellular vitality, distilled
				</p>
				<h1 className="mt-8 font-display text-[2.5rem] sm:text-[3.6rem] lg:text-[4.4rem] font-medium leading-[1.02] tracking-[-0.035em] text-foreground text-balance">
					Upgrade your cellular energy system{" "}
					<span className="inline-flex items-baseline gap-2 align-baseline">
						<span className="font-sans text-[0.5em] font-normal text-muted-foreground">with</span>
						<span
							role="img"
							aria-label="Your Next Store"
							className="inline-flex items-center gap-[0.15em] rounded-full border border-border bg-card px-4 py-1 align-middle text-[0.42em] font-medium tracking-tight"
						>
							<span className="text-moss">your</span>
							<span className="text-muted-foreground">/</span>
							<span>next</span>
						</span>
					</span>
				</h1>
				<p className="mx-auto mt-7 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
					A complete 13-active system built for mitochondrial health, NAD+ metabolism, and long-term cellular
					energy.
				</p>
			</div>

			<div className="relative mt-12 sm:mt-16">
				<div className="relative mx-auto h-[58vh] min-h-[460px] max-h-[760px] w-full overflow-hidden">
					<Image
						src="/scraped-0.jpg"
						alt="Aerial view of a dense forest canopy"
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/30 to-transparent"
					/>
					<div className="absolute inset-x-0 bottom-8 flex justify-center sm:bottom-12">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-primary-foreground shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] transition-all hover:bg-moss"
						>
							<span>Start the 90-day protocol</span>
							<svg
								aria-hidden="true"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								className="transition-transform group-hover:translate-x-0.5"
							>
								<path
									d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
									stroke="currentColor"
									strokeWidth="1.4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</YnsLink>
					</div>
				</div>
			</div>

			<MarqueeBanner />
		</section>
	);
}

function MarqueeBanner() {
	const items = [
		"Third-party tested",
		"Clinically formulated",
		"NSF certified",
		"Practitioner approved",
		"Made in USA",
		"Vegan capsules",
	];
	return (
		<div className="border-y border-border bg-background">
			<div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
				{items.map((item, i) => (
					<span key={item} className="inline-flex items-center gap-3">
						{item}
						{i < items.length - 1 && (
							<span className="hidden sm:inline-block h-1 w-1 rounded-full bg-stone" aria-hidden="true" />
						)}
					</span>
				))}
			</div>
		</div>
	);
}
