import { ArrowUpRight } from "lucide-react";
import { YnsLink } from "../yns-link";

const SHADES = [
	{
		name: "Lavender Mist",
		count: "4 shades",
		swatch: "#b4a4dd",
		bg: "linear-gradient(160deg, #f1ecf8 0%, #d8c9f0 100%)",
		accent: "#5e3ca8",
	},
	{
		name: "Sage Whisper",
		count: "3 shades",
		swatch: "#a8d4d4",
		bg: "linear-gradient(160deg, #e6f0ee 0%, #b9d8d8 100%)",
		accent: "#4f7a78",
	},
	{
		name: "Sunlit Butter",
		count: "4 shades",
		swatch: "#f2c14a",
		bg: "linear-gradient(160deg, #fbf0d4 0%, #f2c14a 100%)",
		accent: "#8a6b1f",
	},
];

function MiniBottle({ color, cap }: { color: string; cap: string }) {
	return (
		<svg viewBox="0 0 110 160" className="h-full w-auto" aria-hidden xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id={`mb-${color}`} x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.9" />
					<stop offset="100%" stopColor={color} stopOpacity="0.55" />
				</linearGradient>
			</defs>
			<ellipse cx="55" cy="153" rx="42" ry="4" fill="#000" opacity="0.15" />
			<rect x="15" y="22" width="80" height="124" rx="10" fill={`url(#mb-${color})`} />
			<rect x="22" y="34" width="66" height="98" rx="6" fill="#ffffff" fillOpacity="0.5" />
			<rect x="42" y="10" width="26" height="16" rx="4" fill={cap} />
		</svg>
	);
}

export function ShopByColor() {
	return (
		<section className="bg-[#f5efe6] py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
					<div className="max-w-2xl">
						<span className="inline-block px-3 py-1 rounded-full bg-[#e4daf5] text-[#5e3ca8] text-[11px] font-semibold uppercase tracking-[0.18em]">
							Shop by color
						</span>
						<h2 className="mt-4 font-display text-[44px] sm:text-[56px] leading-[1] tracking-[-0.025em] text-[#14111c]">
							A shade for every <span className="italic text-[#5e3ca8]">mood.</span>
						</h2>
						<p className="mt-4 text-[15px] text-[#14111c]/65 max-w-md">
							Eleven hand-mixed colorways across three calming families — pick your daily companion.
						</p>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#5e3ca8] hover:text-[#3a2575] transition-colors"
					>
						View All Shades
						<ArrowUpRight className="h-4 w-4" />
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{SHADES.map((shade) => (
						<YnsLink
							prefetch={"eager"}
							key={shade.name}
							href="/products"
							className="group relative aspect-[4/5] rounded-3xl overflow-hidden"
							style={{ background: shade.bg }}
						>
							<div className="absolute inset-0 flex items-end justify-center pb-2">
								<div className="h-[78%] w-[55%] transition-transform duration-700 group-hover:-translate-y-3 group-hover:scale-[1.03]">
									<MiniBottle color={shade.swatch} cap={shade.accent} />
								</div>
							</div>
							<div className="absolute top-6 left-6 right-6 flex items-start justify-between">
								<div>
									<p
										className="text-[11px] font-semibold uppercase tracking-[0.2em]"
										style={{ color: shade.accent }}
									>
										{shade.count}
									</p>
									<h3 className="mt-1 font-display text-[28px] leading-none text-[#14111c]">{shade.name}</h3>
								</div>
								<span className="h-9 w-9 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-sm text-[#14111c] group-hover:bg-[#5e3ca8] group-hover:text-white transition-colors">
									<ArrowUpRight className="h-4 w-4" />
								</span>
							</div>
							<div
								aria-hidden
								className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none"
								style={{
									background: "linear-gradient(to top, rgba(20,17,28,0.12), rgba(20,17,28,0))",
								}}
							/>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
