const BADGES = [
	"Organic",
	"Vegan",
	"Plant-Based",
	"Gluten-Free",
	"Non-GMO",
	"Soy-Free",
	"No Sugar",
	"Kosher",
	"Hemp Hearts",
	"Nutritional Yeast",
];

function Badge({ label, accent }: { label: string; accent: string }) {
	return (
		<div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-white text-[#1b2a2e] shadow-sm border border-[#1b2a2e]/10">
			<div className="text-center px-1">
				<svg viewBox="0 0 24 24" className="mx-auto mb-1 h-4 w-4" aria-hidden="true">
					<title>{label}</title>
					<path d={accent} fill="#1b2a2e" />
				</svg>
				<p className="font-display text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-tight">
					{label}
				</p>
			</div>
		</div>
	);
}

const ICONS = [
	"M12 2 L14 9 L21 9 L15.5 13.5 L17.5 21 L12 17 L6.5 21 L8.5 13.5 L3 9 L10 9 Z",
	"M12 3 C 16 6 17 10 13 14 C 9 10 8 6 12 3 Z",
	"M4 12 L12 4 L20 12 L12 20 Z",
	"M12 2 A10 10 0 1 1 11.99 2 Z M7 12 L11 16 L17 8",
	"M3 7 L21 7 L21 17 L3 17 Z M3 7 L12 13 L21 7",
];

export function CertificationsMarquee() {
	const items = BADGES.flatMap((label, i) => [{ label, icon: ICONS[i % ICONS.length] }]);
	const loop = [...items, ...items, ...items];

	return (
		<section className="relative overflow-hidden bg-[#9f9cf5] py-6 sm:py-8">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#9f9cf5_0%,transparent_8%,transparent_92%,#9f9cf5_100%)] z-10"
			/>
			<div className="flex gap-4 sm:gap-6 whitespace-nowrap plantchi-marquee">
				{loop.map((b, i) => (
					<Badge key={`${b.label}-${i}`} label={b.label} accent={b.icon} />
				))}
			</div>
		</section>
	);
}
