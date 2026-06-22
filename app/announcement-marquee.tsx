function MosquitoIcon({ className = "" }: { className?: string }) {
	return (
		<svg
			width="20"
			height="14"
			viewBox="0 0 32 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<title>Mosquito</title>
			<ellipse cx="16" cy="14.5" rx="4" ry="2.4" fill="currentColor" opacity="0.95" />
			<path d="M16 12.5 L23 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			<path d="M16 12.5 L9 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			<ellipse
				cx="22"
				cy="7"
				rx="6"
				ry="2.4"
				fill="currentColor"
				opacity="0.55"
				transform="rotate(-18 22 7)"
			/>
			<ellipse
				cx="10"
				cy="7"
				rx="6"
				ry="2.4"
				fill="currentColor"
				opacity="0.55"
				transform="rotate(18 10 7)"
			/>
			<path d="M16 14 L16 21" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
			<path d="M19 16 L24 20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
			<path d="M13 16 L8 20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
			<path d="M16 12 L16 8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
		</svg>
	);
}

const ACCOLADES = [
	"Fast Company",
	"2026 World’s Most Innovative Companies",
	"Outside Mag · Best Plant-Powered",
	"Time · 100 Best Inventions",
	"Wirecutter Pick",
	"GQ · Editor’s Approved",
];

export function AnnouncementMarquee() {
	const items = [...ACCOLADES, ...ACCOLADES, ...ACCOLADES];

	return (
		<div className="bg-[var(--tropic-amber)] text-[#3b1f0c] overflow-hidden border-b border-[#a06b1b]/30">
			<div className="relative flex whitespace-nowrap">
				<div className="flex animate-marquee gap-12 py-2.5 will-change-transform">
					{items.map((label, i) => (
						<div
							key={`acc-${i}`}
							className="flex items-center gap-3 text-[11px] sm:text-[12px] font-medium tracking-[0.22em] uppercase"
						>
							<MosquitoIcon />
							<span>{label}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
