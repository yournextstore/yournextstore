import { Star } from "lucide-react";

const PRESS = ["Vogue", "Wallpaper*", "Monocle", "Kinfolk", "Apartamento", "Cereal"];

const QUOTES = [
	{
		quote: "The kind of object that quietly upgrades your day — a pocket-sized piece of considered design.",
		source: "Wallpaper*",
	},
	{
		quote: "Eleven shades, one perfect form factor. The hydration accessory your bag was missing.",
		source: "Vogue",
	},
	{
		quote: "Light, leakproof, lovable. The bottle redesign we didn't know we needed.",
		source: "Monocle",
	},
];

export function PressStrip() {
	return (
		<section className="bg-[#14111c] text-[#f1ecf8] py-16">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">
					<span className="h-px w-10 bg-[#b4a4dd]/40" />
					As Featured In
					<span className="h-px w-10 bg-[#b4a4dd]/40" />
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-5">
					{PRESS.map((p) => (
						<span
							key={p}
							className="font-display text-[22px] sm:text-[26px] text-[#f1ecf8]/70 tracking-tight"
							style={{ fontStyle: p === "Kinfolk" || p === "Cereal" ? "italic" : "normal" }}
						>
							{p}
						</span>
					))}
				</div>

				<div className="mt-14 grid md:grid-cols-3 gap-8">
					{QUOTES.map((q) => (
						<figure key={q.source} className="relative rounded-2xl border border-white/10 p-7">
							<div className="flex items-center gap-0.5 text-[#f2c14a]">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} className="h-3.5 w-3.5 fill-current" />
								))}
							</div>
							<blockquote className="mt-4 font-display text-[18px] leading-snug text-white">
								&ldquo;{q.quote}&rdquo;
							</blockquote>
							<figcaption className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">
								— {q.source}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
