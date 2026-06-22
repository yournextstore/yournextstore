const press = [
	"VOGUE",
	"Bon Appétit",
	"COOL HUNTING",
	"Refinery29",
	"DAZED",
	"The Cut",
	"NYLON",
	"Highsnobiety",
];

export function PressBar() {
	const doubled = [...press, ...press];
	return (
		<section className="bg-[#fbf6ec] border-y border-[#0f0f10]/8 py-10 sm:py-12 overflow-hidden">
			<p className="text-center text-[10px] tracking-[0.5em] uppercase text-[#0f0f10]/60 mb-6">As seen in</p>
			<div className="relative">
				<div className="flex gap-16 yns-marquee whitespace-nowrap">
					{doubled.map((name, i) => (
						<span
							key={`${name}-${i}`}
							className="font-serif italic text-2xl sm:text-3xl text-[#0f0f10]/55 tracking-tight"
						>
							{name}
						</span>
					))}
				</div>
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fbf6ec] to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fbf6ec] to-transparent" />
			</div>
		</section>
	);
}
