import { Focus, Smartphone, ZapOff } from "lucide-react";

const steps = [
	{
		number: "01",
		icon: Smartphone,
		title: "Tap to engage",
		body: "Tap your phone to the YNS tag. No app launch, no menu — just a single, deliberate gesture.",
	},
	{
		number: "02",
		icon: ZapOff,
		title: "Block distractions",
		body: "We pause the apps you choose — social, news, games — so you can be exactly where you are.",
	},
	{
		number: "03",
		icon: Focus,
		title: "Reclaim focus",
		body: "Stay present for two minutes or two hours. Tap again to unwind. No subscription, no friction.",
	},
];

export function HowItWorks() {
	return (
		<section className="relative bg-background py-20 sm:py-28 overflow-hidden">
			<div
				aria-hidden
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[1100px] rounded-full bg-ember/[0.04] blur-3xl"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl">
					<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">How it works</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-bone text-balance">
						Three taps between you and a quieter life.
					</h2>
				</div>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
					{steps.map(({ number, icon: Icon, title, body }) => (
						<div
							key={number}
							className="group relative rounded-2xl border border-border bg-card/50 p-7 hover:border-ember/40 transition-colors"
						>
							<div className="flex items-center justify-between">
								<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bone/5 ring-1 ring-bone/10 group-hover:bg-ember/10 group-hover:ring-ember/30 transition-colors">
									<Icon
										className="h-5 w-5 text-bone group-hover:text-ember transition-colors"
										strokeWidth={1.5}
									/>
								</div>
								<span className="font-display text-sm text-muted-foreground/60 tracking-wider">{number}</span>
							</div>
							<h3 className="mt-8 font-display text-xl font-semibold text-bone">{title}</h3>
							<p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
