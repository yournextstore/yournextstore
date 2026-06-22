import { Droplets, Moon, Sparkles } from "lucide-react";

const benefits = [
	{
		icon: Sparkles,
		title: "Anti-breakage",
		body: "Mulberry silk glides against every strand, reducing the friction that snaps fine and curly hair overnight.",
	},
	{
		icon: Droplets,
		title: "Moisture-lock",
		body: "Unlike cotton, silk doesn't drink the oils your hair worked all day to keep — so curls wake hydrated.",
	},
	{
		icon: Moon,
		title: "Sleep comfort",
		body: "Featherlight, breathable, and tied with a soft elastic so you forget it's there until morning.",
	},
];

export function Benefits() {
	return (
		<section className="bg-bone">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
					{benefits.map(({ icon: Icon, title, body }) => (
						<div key={title} className="flex flex-col items-center text-center">
							<div className="flex items-center justify-center w-12 h-12 rounded-full border border-terracotta/30 bg-terracotta/5 mb-5">
								<Icon className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
							</div>
							<h3 className="font-serif text-2xl text-espresso mb-2">{title}</h3>
							<p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs">{body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
