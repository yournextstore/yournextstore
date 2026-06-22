import { Droplets, Sparkles, Wind } from "lucide-react";

const STEPS = [
	{
		icon: Droplets,
		tile: "bg-yns-pink",
		step: "Step 01",
		title: "Cleanse",
		copy: "A pH-balanced wash that rinses build-up without stripping color or the natural oils your scalp needs.",
	},
	{
		icon: Sparkles,
		tile: "bg-yns-lavender",
		step: "Step 02",
		title: "Treat",
		copy: "Bond-rebuilding amino concentrates that fix the breakage caused by hot tools, sun, and salt.",
	},
	{
		icon: Wind,
		tile: "bg-yns-pink-soft",
		step: "Step 03",
		title: "Finish",
		copy: "A weightless cream that locks in shine, blocks humidity, and gives every blowout that runway bounce.",
	},
];

export function Routine() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center mb-16">
					<p className="text-[11px] tracking-[0.24em] uppercase font-bold text-yns-mauve">
						The Three-Step Ritual
					</p>
					<h2 className="mt-4 yns-display text-3xl sm:text-4xl lg:text-5xl text-yns-ink not-italic uppercase">
						A salon day, every day.
					</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-6 lg:gap-8">
					{STEPS.map(({ icon: Icon, tile, step, title, copy }) => (
						<article
							key={title}
							className="relative rounded-[28px] p-8 border border-yns-pink-soft bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(155,143,184,0.6)]"
						>
							<div className={`${tile} h-16 w-16 rounded-2xl flex items-center justify-center mb-7`}>
								<Icon className="h-7 w-7 text-yns-ink" strokeWidth={1.5} />
							</div>
							<p className="text-[10px] tracking-[0.28em] uppercase font-bold text-yns-mauve">{step}</p>
							<h3 className="mt-2 yns-display text-2xl text-yns-ink not-italic uppercase">{title}</h3>
							<p className="mt-4 text-sm leading-relaxed text-yns-ink/70">{copy}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
