import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import Image from "next/image";

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: ["400", "600"],
	variable: "--font-bricolage",
});

const instrument = Instrument_Sans({
	subsets: ["latin"],
	weight: ["400", "500"],
	style: ["normal", "italic"],
	variable: "--font-instrument",
});

export function StretchHero() {
	return (
		<a
			href="/products"
			className={`${bricolage.variable} ${instrument.variable} relative block h-[calc(100svh-44px)] min-h-[560px] w-full overflow-hidden`}
		>
			<picture>
				<source media="(max-width: 999px)" srcSet="/cloned-hero/hero-mobile.jpg" />
				<Image
					src="/cloned-hero/hero-desktop.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
			</picture>

			<div className="absolute inset-0 flex items-center">
				<div
					className="max-w-[720px] px-5 sm:px-10 lg:px-12"
					style={{ fontFamily: "var(--font-instrument), sans-serif" }}
				>
					<h1
						className="font-normal text-white lowercase"
						style={{
							fontFamily: "var(--font-bricolage), sans-serif",
							fontSize: "clamp(3rem, 2.3325rem + 2.8479vw, 5.75rem)",
							lineHeight: "0.9",
							letterSpacing: "-0.05em",
						}}
					>
						Clean &amp; natural{" "}
						<em className="relative inline-block not-italic">
							<span className="relative z-10">skincare</span>
							<svg
								aria-hidden="true"
								viewBox="0 0 300 100"
								preserveAspectRatio="none"
								className="pointer-events-none absolute z-0 overflow-visible"
								style={{
									top: "-12%",
									left: "-4%",
									width: "108%",
									height: "124%",
								}}
							>
								<path
									d="M 38 62 C 26 32, 90 14, 165 12 C 244 10, 286 28, 283 54 C 280 84, 218 96, 138 94 C 60 92, 16 76, 20 52 C 23 34, 55 22, 95 18"
									fill="none"
									stroke="#d09a3c"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
									vectorEffect="non-scaling-stroke"
								/>
							</svg>
						</em>
						.
					</h1>

					<p
						className="mt-5 max-w-[20rem] text-white text-[13px] leading-[1.4]"
						style={{ fontFamily: "var(--font-instrument), sans-serif" }}
					>
						Made in France and 100% vegan.
					</p>

					<span
						className="mt-7 inline-flex items-center justify-center rounded-full bg-white text-[#321e1e] text-[13px] lowercase transition-transform hover:scale-[1.02]"
						style={{
							fontFamily: "var(--font-instrument), sans-serif",
							padding: "14px 40px",
						}}
					>
						Discover our products
					</span>
				</div>
			</div>
		</a>
	);
}
