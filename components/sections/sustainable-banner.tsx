import { ArrowRightIcon, Leaf, Recycle, Sun } from "lucide-react";
import { YnsLink } from "../yns-link";

const pillars = [
	{
		icon: Leaf,
		title: "Sourced gently",
		body: "Materials chosen for renewability, traced to source, certified at every stage.",
	},
	{
		icon: Recycle,
		title: "Repair, don't replace",
		body: "Each piece comes with a lifetime repair promise — no questions, just craft.",
	},
	{
		icon: Sun,
		title: "Slow, in small batches",
		body: "Made the long way, in studios we know by name. 91% less waste than fast décor.",
	},
];

export function SustainableBanner() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-20 sm:mt-28">
			<div className="relative overflow-hidden rounded-3xl bg-yns-sun">
				<div className="absolute inset-0 yns-sun-stripes opacity-[0.08]" />
				<div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-foreground/10" />
				<div className="absolute -left-20 -bottom-32 h-72 w-72 rounded-full bg-foreground/5" />

				<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 sm:p-12">
					<div className="lg:col-span-5">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-foreground">
							<Leaf className="h-3 w-3" />
							Sustainable Decor
						</span>
						<h2 className="yns-display text-4xl sm:text-5xl text-foreground mt-5 leading-[1.02]">
							Our brilliance &<span className="italic"> eco-touch.</span>
						</h2>
						<p className="mt-4 text-foreground/80 text-base max-w-md leading-relaxed">
							We believe a beautifully made room shouldn&apos;t cost the planet. Every Your Next Store piece
							is built around three quiet commitments.
						</p>
						<YnsLink
							href="#story"
							className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
						>
							Read the manifesto
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
					</div>
					<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 self-end">
						{pillars.map(({ icon: Icon, title, body }) => (
							<div
								key={title}
								className="rounded-2xl bg-background/85 backdrop-blur-sm p-5 ring-1 ring-foreground/5"
							>
								<div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center">
									<Icon className="h-4 w-4" />
								</div>
								<h3 className="yns-display text-lg text-foreground mt-4">{title}</h3>
								<p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{body}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
