const ITEMS = [
	{ text: "Health & Harmony", style: "display" },
	{ text: "Lab-tested", style: "script" },
	{ text: "Regenerative Farming", style: "script" },
	{ text: "Harvested in Portugal", style: "display" },
	{ text: "EU-wide delivery", style: "script" },
	{ text: "Health & Harmony", style: "display" },
	{ text: "Lab-tested", style: "script" },
	{ text: "Regenerative Farming", style: "script" },
	{ text: "Harvested in Portugal", style: "display" },
	{ text: "EU-wide delivery", style: "script" },
] as const;

function MushroomIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 32 32"
			className="h-6 w-6 shrink-0 text-[color:var(--color-mush-yellow)]"
		>
			<path
				d="M5 14c0-6 5-10 11-10s11 4 11 10c0 1.5-1 2.5-2.5 2.5h-17C6 16.5 5 15.5 5 14z"
				fill="currentColor"
			/>
			<path d="M11 16.5c0 5 1.5 9 5 9s5-4 5-9" fill="#3d1f0f" stroke="#3d1f0f" strokeWidth="0.5" />
			<circle cx="12" cy="10" r="1.5" fill="#3d1f0f" />
			<circle cx="18" cy="8" r="2" fill="#3d1f0f" />
			<circle cx="22" cy="12" r="1.2" fill="#3d1f0f" />
		</svg>
	);
}

export function Marquee() {
	return (
		<>
			<div className="relative w-full bg-[color:var(--color-mush-ink)] py-4 overflow-hidden">
				<div className="mush-marquee flex w-max items-center gap-8 whitespace-nowrap">
					{[...ITEMS, ...ITEMS].map((item, i) => (
						<div key={`marq-${i}`} className="flex items-center gap-8">
							<span
								className={
									item.style === "script"
										? "font-script text-2xl text-[color:var(--color-mush-yellow)]"
										: "font-display text-base tracking-[0.18em] uppercase text-[color:var(--color-mush-yellow)]"
								}
							>
								{item.text}
							</span>
							<MushroomIcon />
						</div>
					))}
				</div>
			</div>
			<div className="mush-stripes h-4 w-full bg-[color:var(--color-mush-cream)]" />
		</>
	);
}
