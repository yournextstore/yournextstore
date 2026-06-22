import { Cpu, Fan, MonitorPlay, Shield, Zap } from "lucide-react";

const specs = [
	{
		icon: Cpu,
		title: "Hand-binned silicon",
		body: "Every CPU is tested and undervolted in-house for peak boost stability under sustained load.",
	},
	{
		icon: Fan,
		title: "RGB-tuned cooling",
		body: "360mm AIO loops and high-airflow fan curves dialed to keep package temps below 70°C.",
	},
	{
		icon: MonitorPlay,
		title: "Tournament ready",
		body: "Pre-flashed XMP, latest GPU drivers, and benchmark validation on every build we ship.",
	},
	{
		icon: Shield,
		title: "2-year warranty",
		body: "Parts and labor covered. No-questions return window on every component we sell.",
	},
];

export function About() {
	return (
		<section id="about" className="relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-5">
						<div className="inline-flex items-center gap-2 mb-5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
							<Zap className="h-3 w-3 text-primary" />
							<span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">/about</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.05]">
							Engineered by builders.
							<br />
							<span className="text-muted-foreground">Validated by FPS.</span>
						</h2>
						<p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
							Your Next Store has shipped over twelve thousand custom rigs since 2019. We don&apos;t resell
							boxed systems — every machine is hand-assembled, cable-managed, and stress-tested under your
							exact workload before it hits the truck.
						</p>
					</div>

					<div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
						{specs.map((s) => (
							<div
								key={s.title}
								className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-sm transition-colors hover:border-primary/30"
							>
								<div
									className="inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4"
									style={{
										background: "linear-gradient(135deg, rgba(217,70,196,0.18), rgba(168,85,247,0.12))",
										border: "1px solid rgba(217,70,196,0.25)",
									}}
								>
									<s.icon className="h-5 w-5 text-primary" />
								</div>
								<h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
								<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
