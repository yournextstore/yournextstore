import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[var(--burgundy)]">
			<div className="relative h-[78vh] min-h-[560px] sm:min-h-[640px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
				<div className="absolute inset-0 flex items-center justify-center px-6">
					<div className="text-center">
						<h1 className="font-display uppercase text-[var(--pink)] leading-[0.95] text-[clamp(2.75rem,7vw,6rem)] drop-shadow-[0_2px_0_rgba(255,255,255,0.18)]">
							<span className="block">A Boldly</span>
							<span className="block">Delicious</span>
							<span className="block">Next-Gen Store</span>
						</h1>
						<div className="mt-8 flex justify-center">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-9 rounded-full bg-white text-[var(--pink)] font-display tracking-[0.18em] text-xs uppercase shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
							>
								Shop Now
							</YnsLink>
						</div>
					</div>
				</div>
				{/* floating sparkle stickers */}
				<div className="pointer-events-none absolute top-12 left-8 hidden md:block">
					<StarBadge color="var(--yellow)" text="NEW!" />
				</div>
				<div className="pointer-events-none absolute bottom-24 right-10 hidden md:block">
					<StarBadge color="var(--tangerine)" text="HOT" />
				</div>
			</div>
			{/* Scalloped white wave divider into the next block */}
			<div className="relative -mt-px">
				<svg
					className="block w-full h-[80px] sm:h-[110px]"
					viewBox="0 0 1440 110"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M0,60 C180,110 360,0 540,50 C720,100 900,10 1080,55 C1260,100 1380,30 1440,60 L1440,110 L0,110 Z"
						fill="var(--background)"
					/>
				</svg>
			</div>
		</section>
	);
}

function StarBadge({ color, text }: { color: string; text: string }) {
	return (
		<div
			className="yns-starburst flex items-center justify-center w-20 h-20 yns-hover-wiggle"
			style={{ background: color }}
		>
			<span className="font-display text-[var(--burgundy)] text-xs tracking-widest">{text}</span>
		</div>
	);
}
