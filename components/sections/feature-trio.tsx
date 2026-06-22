import { Compass, Feather, Moon } from "lucide-react";

const FEATURES = [
	{
		id: "what",
		eyebrow: "What",
		title: "A pocket of calm.",
		description:
			"Each object is shaped to the hand. No screens to slip into, no notifications to outrun — just the thing itself.",
		Icon: Moon,
	},
	{
		id: "how",
		eyebrow: "How",
		title: "Slow craft.",
		description:
			"Made by small studios who measure twice and finish by hand. We choose materials that age, not expire.",
		Icon: Feather,
	},
	{
		id: "why",
		eyebrow: "Why",
		title: "Quietly different.",
		description:
			"Built for the late-night thinker, the long-walker, the patient reader. Designed to last past the trend.",
		Icon: Compass,
	},
];

export function FeatureTrio() {
	return (
		<section className="relative bg-background">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			<div className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden ring-moon">
					{FEATURES.map(({ id, eyebrow, title, description, Icon }) => (
						<div
							id={id}
							key={id}
							className="relative bg-[#0b1024]/70 backdrop-blur-sm p-10 sm:p-12 group transition-colors hover:bg-[#0f1430]/80"
						>
							<div className="flex items-center gap-3 mb-8">
								<div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#1a1f3a]/50">
									<Icon className="h-4 w-4 text-[#b8b6ce]" />
								</div>
								<span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
									{eyebrow}
								</span>
							</div>
							<h3 className="font-serif text-2xl sm:text-[28px] font-light leading-tight">{title}</h3>
							<p className="mt-4 text-sm sm:text-[15px] text-muted-foreground leading-relaxed font-light">
								{description}
							</p>
							<div className="mt-10 h-px w-12 bg-[#4a76ff]/40 group-hover:w-20 transition-all duration-500" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
