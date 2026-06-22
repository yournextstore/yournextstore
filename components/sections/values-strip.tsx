type Value = {
	title: string;
	body: string;
	icon: React.ReactNode;
};

const values: Value[] = [
	{
		title: "Real Ingredients",
		body: "Whole foods you can pronounce. Nothing weird, nothing extra.",
		icon: (
			<svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
				<circle cx="32" cy="32" r="22" fill="#fbf4e8" stroke="#4a2c1a" strokeWidth="2.5" />
				<path d="M22 36 Q 32 24 42 36" stroke="#4a2c1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
				<circle cx="26" cy="28" r="1.8" fill="#4a2c1a" />
				<circle cx="38" cy="28" r="1.8" fill="#4a2c1a" />
			</svg>
		),
	},
	{
		title: "Lactose-Free Friendly",
		body: "Naturally cultured so even sensitive tummies feel good.",
		icon: (
			<svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
				<path
					d="M32 10 C 22 14 18 22 18 32 C 18 42 24 50 32 54 C 40 50 46 42 46 32 C 46 22 42 14 32 10 Z"
					fill="#fbf4e8"
					stroke="#4a2c1a"
					strokeWidth="2.5"
				/>
				<path
					d="M28 24 Q 32 28 28 34 Q 32 38 28 44"
					stroke="#4a2c1a"
					strokeWidth="2.5"
					fill="none"
					strokeLinecap="round"
				/>
			</svg>
		),
	},
	{
		title: "Family Owned",
		body: "Sustaining small farms by paying farmers what they're worth.",
		icon: (
			<svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
				<path
					d="M12 32 L 32 14 L 52 32 L 52 52 L 12 52 Z"
					fill="#fbf4e8"
					stroke="#4a2c1a"
					strokeWidth="2.5"
					strokeLinejoin="round"
				/>
				<path d="M26 52 L 26 38 L 38 38 L 38 52" fill="none" stroke="#4a2c1a" strokeWidth="2.5" />
				<path d="M32 14 L 32 8" stroke="#4a2c1a" strokeWidth="2.5" strokeLinecap="round" />
				<path d="M28 10 L 36 10" stroke="#4a2c1a" strokeWidth="2.5" strokeLinecap="round" />
			</svg>
		),
	},
];

export function ValuesStrip() {
	return (
		<section className="bg-[#a8b5a0] text-[#3a2418]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
				<div className="grid gap-10 sm:gap-6 md:grid-cols-3">
					{values.map((value) => (
						<div
							key={value.title}
							className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4"
						>
							<div className="shrink-0">{value.icon}</div>
							<div>
								<h3 className="font-display text-xl sm:text-2xl font-extrabold">{value.title}</h3>
								<p className="mt-1 text-sm sm:text-base text-[#3a2418]/80 leading-relaxed">{value.body}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
