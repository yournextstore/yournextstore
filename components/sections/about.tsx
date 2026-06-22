import { PackageCheck, RefreshCcw, Sparkles } from "lucide-react";

const perks = [
	{
		icon: Sparkles,
		title: "Skip a month, cancel anytime",
		body: "Your routine, your rules. Pause or cancel with two taps — no awkward emails.",
		bg: "bg-[var(--color-sky)]/35",
	},
	{
		icon: PackageCheck,
		title: "Free carbon-neutral shipping",
		body: "We offset every package and ship in compostable mailers from Salt Lake City.",
		bg: "bg-[var(--color-yellow)]/55",
	},
	{
		icon: RefreshCcw,
		title: "Refill, save 20%",
		body: "Send back your empty tubes — we'll refill and ship a fresh one at a discount.",
		bg: "bg-[var(--color-coral)]/35",
	},
] as const;

export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
					{perks.map((p) => (
						<div key={p.title} className={`rounded-3xl ${p.bg} p-6 sm:p-7`}>
							<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-[var(--color-navy)]">
								<p.icon className="h-5 w-5" />
							</div>
							<h3 className="mt-5 font-display text-xl font-extrabold tracking-tight text-foreground">
								{p.title}
							</h3>
							<p className="mt-2 text-sm text-foreground/75 leading-relaxed">{p.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
