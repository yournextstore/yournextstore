import Image from "next/image";

const features = [
	{
		title: "Hand-iced",
		body: "Pink frosting piped on every heart, by hand, one tray at a time.",
	},
	{
		title: "Brown butter base",
		body: "We brown the butter until it smells like toffee. It's not faster. It's better.",
	},
	{
		title: "Real chocolate",
		body: "Single-origin chunks — never chip-shaped soy oil. You can taste the difference.",
	},
	{
		title: "Sealed for freshness",
		body: "Nitrogen-flushed bags inside cloth-wrapped boxes. Day-7 cookies taste like day-1.",
	},
];

export function About() {
	return (
		<section id="about" className="bg-cream-paper">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
					<div>
						<p className="text-xs font-bold tracking-[0.3em] text-[var(--candy)] uppercase">
							INSIDE EVERY BOX
						</p>
						<h2 className="mt-3 font-display italic text-[var(--maroon)] text-4xl sm:text-5xl lg:text-6xl tracking-tight">
							Made the slow way,
							<br />
							on purpose.
						</h2>
						<p className="mt-6 text-lg text-[var(--ink)]/80 leading-relaxed">
							We tested every recipe at least 40 times. Then we picked the one our grandmas approved of. This
							is small-batch baking with zero shortcuts, packed up like a love letter.
						</p>

						<dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
							{features.map((f) => (
								<div key={f.title} className="border-t border-[var(--maroon)]/20 pt-4">
									<dt className="font-display italic text-2xl text-[var(--maroon)]">{f.title}</dt>
									<dd className="mt-1 text-sm text-[var(--ink)]/70 leading-relaxed">{f.body}</dd>
								</div>
							))}
						</dl>
					</div>

					<div className="relative grid grid-cols-2 gap-4">
						<div className="relative aspect-[3/4] rounded-3xl overflow-hidden mt-10">
							<Image
								src="/scraped-1.jpg"
								alt="Heart-iced cookies arranged with ribbon"
								fill
								sizes="(max-width: 1024px) 50vw, 30vw"
								className="object-cover"
							/>
						</div>
						<div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
							<Image
								src="/scraped-3.jpg"
								alt="Icing being piped onto cookies in the kitchen"
								fill
								sizes="(max-width: 1024px) 50vw, 30vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
