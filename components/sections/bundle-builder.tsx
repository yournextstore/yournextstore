import { ArrowRightIcon, Check } from "lucide-react";
import { YnsLink } from "../yns-link";

const BUNDLES = [
	{
		step: "01",
		title: "Duo Set",
		count: "Pick 2",
		save: "15% off",
		desc: "Two matching bottles for you & your favorite person.",
		swatches: ["#b4a4dd", "#a8d4d4"],
		tint: "#f1ecf8",
	},
	{
		step: "02",
		title: "Family Pack",
		count: "Pick 3",
		save: "22% off",
		desc: "Three shades to share at home, the office, or on the road.",
		swatches: ["#e8b89c", "#f2c14a", "#b4a4dd"],
		tint: "#fdf3e6",
	},
	{
		step: "03",
		title: "The Rainbow",
		count: "Pick 4",
		save: "30% off",
		desc: "Our biggest savings — collect the full pastel quartet.",
		swatches: ["#f2c14a", "#e8b89c", "#a8d4d4", "#b4a4dd"],
		tint: "#e6f0ee",
	},
];

export function BundleBuilder() {
	return (
		<section id="bundles" className="relative bg-mesh-pastel py-20 sm:py-28 overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative">
				<div className="text-center max-w-2xl mx-auto">
					<span className="inline-block px-3 py-1 rounded-full bg-white/70 text-[#5e3ca8] text-[11px] font-semibold uppercase tracking-[0.18em]">
						Build your set
					</span>
					<h2 className="mt-4 font-display text-[44px] sm:text-[56px] leading-[1] tracking-[-0.025em] text-[#14111c]">
						The more you mix, <span className="italic text-[#5e3ca8]">the more you save.</span>
					</h2>
					<p className="mt-4 text-[15px] text-[#14111c]/70">
						Pick a step. Pick your shades. Watch the savings stack — no codes, no hoops.
					</p>
				</div>

				<div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
					{BUNDLES.map((b, i) => (
						<div
							key={b.step}
							className="group relative flex flex-col rounded-3xl bg-white p-7 border border-[#e8dfd0] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(94,60,168,0.4)] transition-all"
						>
							<div className="flex items-center justify-between">
								<span className="font-display text-[44px] leading-none text-[#14111c]/15" aria-hidden>
									{b.step}
								</span>
								<span
									className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] text-[#5e3ca8]"
									style={{ background: b.tint }}
								>
									{b.save}
								</span>
							</div>
							<div className="mt-6 flex h-32 items-end justify-center gap-1.5">
								{b.swatches.map((c, j) => (
									<div
										key={`${b.step}-${j}`}
										className="w-9 rounded-md rounded-b-sm"
										style={{
											height: `${70 + j * 6}%`,
											background: `linear-gradient(180deg, ${c}cc, ${c})`,
											boxShadow: `inset -3px -4px 8px rgba(0,0,0,0.08)`,
										}}
									/>
								))}
							</div>
							<div className="mt-6">
								<p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#5e3ca8]">
									{b.count}
								</p>
								<h3 className="mt-1 font-display text-[28px] leading-tight text-[#14111c]">{b.title}</h3>
								<p className="mt-2 text-[14px] text-[#14111c]/65 leading-relaxed">{b.desc}</p>
							</div>
							<ul className="mt-5 space-y-1.5">
								{["Free delivery", "Gift-ready box", "Mix any colors"].map((p) => (
									<li key={p} className="flex items-center gap-2 text-[13px] text-[#14111c]/75">
										<Check className="h-3.5 w-3.5 text-[#5e3ca8]" strokeWidth={2.5} />
										{p}
									</li>
								))}
							</ul>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className={`mt-7 inline-flex items-center justify-center gap-2 h-11 rounded-full text-[14px] font-semibold transition-all ${
									i === 1
										? "bg-[#5e3ca8] text-white hover:bg-[#4e2f95]"
										: "bg-[#14111c] text-white hover:bg-[#5e3ca8]"
								}`}
							>
								Build the {b.title}
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							{i === 1 && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#f2c14a] text-[#14111c] text-[11px] font-bold uppercase tracking-[0.16em]">
									Most Loved
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
