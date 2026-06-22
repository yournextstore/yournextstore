import Image from "next/image";

const NOTES = [
	{ n: "01", label: "melatonin", detail: "0.3 mg micro-dose", angle: "top-[18%] left-[10%]" },
	{ n: "02", label: "l-theanine", detail: "calms the cortisol spike", angle: "top-[38%] right-[8%]" },
	{
		n: "03",
		label: "magnesium glycinate",
		detail: "for the 3 a.m. leg twitch",
		angle: "bottom-[24%] left-[12%]",
	},
	{
		n: "04",
		label: "passionflower",
		detail: "ancestral, slightly witchy",
		angle: "bottom-[12%] right-[14%]",
	},
];

export function Ingredients() {
	return (
		<section className="relative bg-[var(--yns-red)] text-white overflow-hidden">
			<div className="absolute inset-0 yns-hero-gradient opacity-90" aria-hidden="true" />
			<div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
					<div>
						<span className="text-[10px] uppercase tracking-[0.3em] text-white/70">the formula</span>
						<h2 className="mt-4 font-[family-name:var(--font-display)] italic text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
							four ingredients<span className="text-[var(--yns-cream)]">,</span>
							<br />
							one very <span className="text-[var(--yns-cream)]">soft</span> ending
							<span className="not-italic">.</span>
						</h2>
						<p className="mt-6 max-w-md text-sm sm:text-base text-white/85 leading-relaxed lowercase">
							no proprietary blends. no &ldquo;sleepy&rdquo; flavorings. no melatonin overdose. just the four
							molecules your nervous system was hoping you&rsquo;d remember.
						</p>

						<dl className="mt-10 grid grid-cols-2 gap-4 max-w-md">
							{NOTES.map((note) => (
								<div key={note.n} className="border-t border-white/30 pt-4">
									<dt className="text-[10px] uppercase tracking-[0.3em] text-white/70 flex items-center gap-2">
										<span className="text-[var(--yns-cream)]">{note.n}</span> {note.label}
									</dt>
									<dd className="mt-1 text-sm text-white lowercase">{note.detail}</dd>
								</div>
							))}
						</dl>
					</div>

					<div className="relative aspect-square max-w-md mx-auto w-full">
						<div className="absolute inset-0 rounded-full border border-white/30" />
						<div className="absolute inset-8 rounded-full border border-white/20" />
						<div className="absolute inset-16 rounded-full border border-white/10" />
						<div className="absolute inset-[20%] overflow-hidden rounded-full ring-2 ring-white/40">
							<Image
								src="/scraped-5.jpg"
								alt=""
								fill
								sizes="(max-width: 1024px) 80vw, 40vw"
								className="object-cover mix-blend-multiply"
							/>
						</div>
						{NOTES.map((note) => (
							<div
								key={note.n}
								className={`absolute ${note.angle} flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]`}
							>
								<span className="w-2 h-2 bg-[var(--yns-cream)] rounded-full" />
								<span className="text-white/90 whitespace-nowrap">
									<span className="text-[var(--yns-cream)]">{note.n}</span> · {note.label}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
