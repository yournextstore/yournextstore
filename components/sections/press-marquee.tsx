const PRESS = [
	"vogue",
	"the cut",
	"highsnobiety",
	"nylon",
	"i-d",
	"dazed",
	"another mag",
	"office",
	"ssense",
	"vogue",
	"the cut",
	"highsnobiety",
	"nylon",
	"i-d",
	"dazed",
	"another mag",
	"office",
	"ssense",
];

export function PressMarquee() {
	return (
		<section className="bg-[var(--yns-paper)] border-y border-[var(--yns-ink)]/10 overflow-hidden">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-6">
				<span className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-[var(--yns-red)]">
					as seen in
				</span>
				<div className="relative flex-1 overflow-hidden mask-fade">
					<div className="yns-marquee flex items-center gap-12 whitespace-nowrap will-change-transform">
						{PRESS.concat(PRESS).map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-[var(--yns-ink)]/40 hover:text-[var(--yns-red)] transition-colors"
							>
								{name}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
