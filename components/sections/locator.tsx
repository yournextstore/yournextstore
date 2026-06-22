import { MapPin } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Locator() {
	return (
		<section className="relative overflow-hidden bg-[color:var(--dusty-blue)] text-[color:var(--cream)]">
			{/* abstract map SVG background */}
			<svg
				aria-hidden
				viewBox="0 0 1200 400"
				className="absolute inset-0 w-full h-full opacity-[0.18]"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
						<circle cx="2" cy="2" r="1.2" fill="#f4ebd8" />
					</pattern>
				</defs>
				<rect width="1200" height="400" fill="url(#dots)" />
				<path d="M0 220 Q200 140 380 200 T780 180 T1200 240" fill="none" stroke="#f4ebd8" strokeWidth="1.5" />
				<path d="M0 280 Q300 200 540 270 T1100 220" fill="none" stroke="#f4ebd8" strokeWidth="1.5" />
				<circle cx="220" cy="170" r="6" fill="#c97c5d" />
				<circle cx="520" cy="220" r="6" fill="#c97c5d" />
				<circle cx="760" cy="180" r="6" fill="#c97c5d" />
				<circle cx="980" cy="240" r="6" fill="#c97c5d" />
			</svg>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
				<div>
					<p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[color:var(--cream)]/70 mb-3">
						Find us in the wild
					</p>
					<h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.94]">
						2,400+ shelves
						<br />
						across the country.
					</h2>
					<p className="mt-5 text-base sm:text-lg leading-relaxed text-[color:var(--cream)]/80 max-w-md">
						From corner bottle shops to your favorite rooftop bar. Pop in your zip and grab a four-pack.
					</p>
					<form className="mt-8 flex max-w-md gap-3">
						<input
							type="text"
							inputMode="numeric"
							placeholder="Enter your zip code"
							className="h-12 flex-1 rounded-full bg-[color:var(--cream)]/10 border border-[color:var(--cream)]/30 px-5 text-[color:var(--cream)] placeholder:text-[color:var(--cream)]/50 outline-none focus:border-[color:var(--cream)] focus:bg-[color:var(--cream)]/15 transition-colors"
						/>
						<YnsLink
							href="/products"
							prefetch={"eager"}
							className="inline-flex items-center h-12 px-6 rounded-full bg-[color:var(--cream)] text-[color:var(--charcoal)] text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-[color:var(--cream-deep)] transition-colors"
						>
							Find us
						</YnsLink>
					</form>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:gap-4">
					{[
						["New York", "412 stores"],
						["Los Angeles", "356 stores"],
						["Austin", "118 stores"],
						["Chicago", "212 stores"],
					].map(([city, count]) => (
						<div
							key={city}
							className="rounded-sm border border-[color:var(--cream)]/25 p-5 sm:p-6 bg-[color:var(--cream)]/[0.06] backdrop-blur-sm"
						>
							<div className="flex items-center gap-2 text-[color:var(--terracotta)]">
								<MapPin className="h-4 w-4" />
								<span className="text-[10px] uppercase tracking-[0.22em] font-semibold">In stock</span>
							</div>
							<p className="mt-3 font-display text-xl sm:text-2xl text-[color:var(--cream)]">{city}</p>
							<p className="text-sm text-[color:var(--cream)]/70 mt-1">{count}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
