import Image from "next/image";

const credentials = [
	{ label: "5×", copy: "Distilled spirits, smooth and clean" },
	{ label: "0g", copy: "Sugar — never sweetened, always crisp" },
	{ label: "72", copy: "Calories per can, full flavor inside" },
	{ label: "100%", copy: "Natural fruit, no artificial nonsense" },
];

export function About() {
	return (
		<section id="about" className="bg-fizz-cream relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fizz-aqua/40 blur-3xl"
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					<div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden sticker-shadow">
						<Image
							src="/scraped-3.jpg"
							alt="Pool-side lifestyle"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute top-5 left-5 inline-flex items-center px-4 h-9 rounded-full bg-fizz-yellow text-fizz-ink text-xs font-bold uppercase tracking-[0.2em]">
							Hand-mixed · Hand-canned
						</div>
					</div>

					<div>
						<p className="text-xs uppercase tracking-[0.35em] font-bold text-fizz-sky mb-3">The Recipe</p>
						<h2 className="font-display uppercase text-fizz-ink text-3xl sm:text-5xl leading-[0.95] tracking-tight">
							Three ingredients.
							<br />
							<span className="text-fizz-berry">No shortcuts.</span>
						</h2>
						<p className="mt-6 text-lg text-fizz-ink/80 leading-relaxed max-w-lg font-medium">
							Five-times distilled spirits, purified still water, and natural fruit. That&apos;s the whole
							label — and the whole secret. We make every can for the moments where bubbles get in the way.
						</p>

						<dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
							{credentials.map((c) => (
								<div key={c.label} className="border-l-2 border-fizz-berry pl-4">
									<dt className="font-display text-fizz-berry text-3xl sm:text-4xl leading-none">
										{c.label}
									</dt>
									<dd className="mt-2 text-sm text-fizz-ink/70 font-medium leading-snug">{c.copy}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
