import Image from "next/image";

const STEPS = [
	{
		num: "01",
		title: "Spread it",
		body: "Slather it on warm sourdough with a sleepy morning drizzle of honey.",
		image: "/scraped-4.jpg",
		tone: "bg-mustard",
	},
	{
		num: "02",
		title: "Dip it",
		body: "Pita, cracker, carrot, finger — anything goes. We won't tell.",
		image: "/scraped-5.jpg",
		tone: "bg-sky",
	},
	{
		num: "03",
		title: "Swirl it",
		body: "Top it with olive oil, za'atar, or a fistful of herbs from the windowsill.",
		image: "/scraped-1.jpg",
		tone: "bg-cherry text-cream",
	},
];

export function HowToEnjoy() {
	return (
		<section id="how-to" className="relative bg-cream py-20 sm:py-28 border-y border-ink/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-end gap-6 mb-12">
					<div>
						<span className="inline-block rounded-full bg-cherry text-cream px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
							A field guide
						</span>
						<h2
							className="yns-display mt-5 text-ink leading-[0.85]"
							style={{ fontSize: "clamp(2.75rem, 8vw, 6.5rem)" }}
						>
							How to <br />
							<span className="text-cherry">enjoy</span>
						</h2>
					</div>
					<div className="hidden lg:block">
						<svg width="120" height="120" viewBox="0 0 120 120" className="text-ink/60" aria-hidden="true">
							<title>arrow</title>
							<path
								d="M20 60 Q60 20 100 60"
								stroke="currentColor"
								strokeWidth="2.4"
								fill="none"
								strokeDasharray="6 6"
								strokeLinecap="round"
							/>
							<path
								d="M92 52 L102 60 L94 70"
								stroke="currentColor"
								strokeWidth="2.4"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<p className="lg:text-right text-base sm:text-lg text-ink/75 leading-relaxed max-w-md lg:ml-auto">
						Three simple moves, infinite combinations. Slather, dip, swirl — repeat until the jar is empty and
						your friends are jealous.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
					{STEPS.map((step) => (
						<div
							key={step.num}
							className={`group relative rounded-[2rem] overflow-hidden ${step.tone} p-6 sm:p-8 flex flex-col gap-6 min-h-[420px] transition-transform duration-500 hover:-translate-y-1`}
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold uppercase tracking-[0.3em]">{step.num}</span>
								<span className="text-xs font-semibold uppercase tracking-widest">Method</span>
							</div>

							<div className="relative aspect-[5/4] rounded-2xl overflow-hidden ring-4 ring-cream/95">
								<Image
									src={step.image}
									alt={step.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>

							<div>
								<h3 className="yns-display" style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}>
									{step.title}
								</h3>
								<p className="mt-2 text-sm sm:text-[15px] leading-relaxed opacity-90">{step.body}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
