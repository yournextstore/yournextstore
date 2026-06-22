import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-[#b81e26]">
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] lg:min-h-[640px]">
				{/* Left: product still-life against red tile */}
				<div className="relative overflow-hidden bg-[#b81e26] hayati-tile-bg">
					<div
						aria-hidden
						className="absolute inset-0 bg-[radial-gradient(120%_70%_at_30%_30%,rgba(244,194,203,0.45)_0%,transparent_60%)]"
					/>
					<Image
						src="/scraped-0.jpg"
						alt="Premium za'atar spice tin on white plate"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover mix-blend-multiply opacity-95"
					/>
					{/* Falling pink petals overlay */}
					<svg
						aria-hidden
						className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
						viewBox="0 0 800 800"
						preserveAspectRatio="none"
					>
						<title>petals</title>
						{[
							{ cx: 120, cy: 90, r: 6 },
							{ cx: 260, cy: 200, r: 4 },
							{ cx: 540, cy: 60, r: 5 },
							{ cx: 700, cy: 220, r: 6 },
							{ cx: 80, cy: 360, r: 4 },
							{ cx: 360, cy: 90, r: 3 },
							{ cx: 640, cy: 420, r: 5 },
						].map((p, i) => (
							<circle key={`petal-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#f4c2cb" opacity={0.6} />
						))}
					</svg>
				</div>

				{/* Right: lifestyle pour shot */}
				<div className="relative overflow-hidden bg-[#2b2120]">
					<Image
						src="/scraped-1.jpg"
						alt="Pouring za'atar into a blush ceramic bowl"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-r from-[#2b2120]/30 via-transparent to-[#7a0e15]/30"
					/>
				</div>
			</div>

			{/* Floating editorial headline */}
			<div className="absolute inset-x-0 bottom-0 translate-y-1/2 pointer-events-none px-4">
				<div className="max-w-3xl mx-auto bg-[#fbe5ea] text-[#7a0e15] rounded-[28px] shadow-[0_30px_60px_-30px_rgba(122,14,21,0.45)] border border-[#efd6dc] px-8 sm:px-12 py-8 sm:py-10 text-center pointer-events-auto">
					<div className="hayati-divider mb-4 text-xs">
						<span className="hayati-star" />
						<span className="hayati-star" />
						<span className="hayati-star" />
					</div>
					<h1 className="font-display italic text-3xl sm:text-4xl lg:text-5xl leading-tight">
						Heritage spice, hand-blended for the modern pantry.
					</h1>
					<p className="mt-4 text-sm sm:text-base text-[#7a0e15]/70 max-w-xl mx-auto">
						Small-batch za&apos;atar, sumac and rose petal blends sourced direct from family millers across
						the Levant.
					</p>
					<div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-[#b81e26] text-[#fbe5ea] text-sm font-medium tracking-wide hover:bg-[#7a0e15] transition-colors"
						>
							Shop the pantry
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#about"
							className="inline-flex items-center justify-center h-11 px-7 rounded-full border border-[#b81e26]/40 text-[#7a0e15] text-sm font-medium tracking-wide hover:bg-white/60 transition-colors"
						>
							Our story
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
