function CloudIcon() {
	return (
		<svg
			viewBox="0 0 64 32"
			className="h-7 w-12 sm:h-8 sm:w-14 shrink-0 text-fizz-aqua-deep"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M14 26c-6 0-10-3.6-10-8s4-8 10-8c1.3 0 2.5.2 3.6.6C19.1 6.4 24 3 30 3c7 0 12 4.5 12 11 0 .5 0 1-.1 1.5C46 16 50 18.7 50 23s-4 7-9 7H14z"
			/>
			{/* sunglasses */}
			<g fill="#1a1f3a">
				<rect x="18" y="14" width="11" height="7" rx="2" />
				<rect x="32" y="14" width="11" height="7" rx="2" />
				<rect x="28" y="16" width="5" height="2" />
			</g>
			{/* smile */}
			<path d="M22 24c2 2 5 2 7 0" stroke="#1a1f3a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
		</svg>
	);
}

export function Ticker() {
	const items = ["0 Fizz", "0 Sugar", "72 Cals", "5× Distilled", "All Natural", "Gluten Free"];
	const row = (
		<div className="flex items-center gap-10 sm:gap-14 px-5 sm:px-7 shrink-0">
			{items.map((item, i) => (
				<div key={`tk-${i}`} className="flex items-center gap-10 sm:gap-14 shrink-0">
					<span className="font-display text-fizz-ink text-3xl sm:text-5xl uppercase tracking-tight whitespace-nowrap">
						{item}
					</span>
					<CloudIcon />
				</div>
			))}
		</div>
	);

	return (
		<section
			aria-label="Product claims"
			className="bg-fizz-yellow border-y-2 border-fizz-ink/10 py-5 sm:py-6 overflow-hidden"
		>
			<div className="flex w-max animate-marquee">
				{row}
				{row}
			</div>
		</section>
	);
}
