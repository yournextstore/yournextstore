import Image from "next/image";

const steps = [
	{
		num: "01",
		title: "Prepare",
		image: "/scraped-5.jpg",
		body: "Draw the morning curtain halfway. Let the room warm. Bare shoulders, soft breath, no rush.",
	},
	{
		num: "02",
		title: "Press",
		image: "/scraped-3.jpg",
		body: "Two drops into the heart of the palm. Press, do not rub. Feel the oil bloom warm.",
	},
	{
		num: "03",
		title: "Trace",
		image: "/scraped-1.jpg",
		body: "From collarbone to wrist. Slow figure-eights along the throat. Linger where the pulse answers.",
	},
	{
		num: "04",
		title: "Pause",
		image: "/scraped-4.jpg",
		body: "Sit with the warmth for one full minute. The ritual is not the product — it is the listening.",
	},
];

export function Ritual() {
	return (
		<section className="bg-bone">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
				<div className="max-w-2xl mb-16">
					<p className="eyebrow text-rosewood mb-5">The Ritual</p>
					<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-light leading-[1.05]">
						Four breaths to <span className="italic text-rosewood">unhurry the morning.</span>
					</h2>
					<p className="mt-6 text-ink/65 text-base leading-relaxed">
						A small invitation we send with every order. Print it. Tape it to the mirror. Forget it on
						purpose.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
					{steps.map((step) => (
						<article key={step.num} className="group">
							<div className="relative aspect-[3/4] w-full overflow-hidden bg-sand">
								<Image
									src={step.image}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, 25vw"
									className="object-cover saturate-[0.95] mix-blend-multiply transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
								/>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bone/15" />
								<span className="absolute top-5 left-5 font-serif italic text-bone text-3xl drop-shadow-sm">
									{step.num}
								</span>
							</div>
							<div className="mt-5 pl-1">
								<div className="flex items-baseline gap-3">
									<p className="eyebrow text-rosewood text-[0.65rem]">Step {step.num}</p>
									<span className="h-px flex-1 bg-ink/15" />
								</div>
								<h3 className="mt-3 font-serif text-2xl text-ink font-normal">{step.title}</h3>
								<p className="mt-2 text-ink/65 text-sm leading-relaxed">{step.body}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
