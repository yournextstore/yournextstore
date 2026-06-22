import { Star } from "lucide-react";

const press = [
	"Vogue",
	"GQ",
	"Bon Appétit",
	"The New York Times",
	"Allure",
	"Apartment Therapy",
	"Wallpaper*",
	"Monocle",
] as const;

const endorsements = [
	{
		name: "Dr. Lena Park, DDS",
		role: "Cosmetic dentist — Brooklyn",
		quote: "The only flavor-forward toothpaste I actually recommend to patients.",
	},
	{
		name: "Dr. Aman Bose, DDS, MPH",
		role: "Pediatric specialist — Austin",
		quote: "Finally — a brand my kids ask for. Nano-hydroxyapatite without the gimmicks.",
	},
] as const;

export function PressStrip() {
	return (
		<section className="bg-background border-y border-border">
			<div className="overflow-hidden py-8">
				<div className="flex w-max items-center gap-12 yns-marquee">
					{[...press, ...press].map((name, i) => (
						<span
							key={`${name}-${i}`}
							className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.12em] text-muted-foreground/70 whitespace-nowrap"
						>
							{name}
						</span>
					))}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{endorsements.map((e) => (
						<figure
							key={e.name}
							className="rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-[0_20px_50px_-30px_rgba(30,36,54,0.25)]"
						>
							<div className="flex items-center gap-1 text-[var(--color-sunshine)]">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} className="h-4 w-4 fill-current" />
								))}
							</div>
							<blockquote className="mt-4 font-display text-xl sm:text-2xl font-bold leading-snug text-foreground">
								“{e.quote}”
							</blockquote>
							<figcaption className="mt-5 text-sm">
								<span className="font-semibold text-foreground">{e.name}</span>
								<span className="text-muted-foreground"> — {e.role}</span>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
