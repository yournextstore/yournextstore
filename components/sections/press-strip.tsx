const PRESS = [
	"GQ",
	"Monocle",
	"Wallpaper*",
	"Esquire",
	"FT — How To Spend It",
	"Hypebeast",
	"Cool Hunting",
	"T Magazine",
];

export function PressStrip() {
	const items = [...PRESS, ...PRESS];

	return (
		<section
			className="relative parchment-noise border-y border-foreground/10 overflow-hidden"
			style={{ backgroundColor: "#f5efe4" }}
		>
			<div className="px-6 sm:px-10 lg:px-14 pt-14 pb-6">
				<div className="flex items-baseline justify-between gap-6">
					<p className="eyebrow text-taupe">As written about by</p>
					<p className="hidden sm:block font-mono text-[0.6rem] tracking-[0.28em] uppercase text-taupe/60">
						2024 — 2026 / Selected press
					</p>
				</div>
			</div>
			<div className="relative">
				<div
					className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
					style={{ background: "linear-gradient(90deg, #f5efe4 0%, transparent 100%)" }}
				/>
				<div
					className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
					style={{ background: "linear-gradient(270deg, #f5efe4 0%, transparent 100%)" }}
				/>
				<div className="flex whitespace-nowrap animate-marquee w-max">
					{items.map((name, idx) => (
						<span
							key={`${name}-${idx}`}
							className="font-serif italic text-3xl sm:text-4xl text-umber/65 mx-10 sm:mx-14"
						>
							{name}
						</span>
					))}
				</div>
			</div>
			<div className="px-6 sm:px-10 lg:px-14 py-8 flex items-center justify-between font-mono text-[0.55rem] tracking-[0.3em] uppercase text-taupe/55">
				<span>YNS — File no. 042</span>
				<span>Index of mentions, updated quarterly</span>
			</div>
		</section>
	);
}
