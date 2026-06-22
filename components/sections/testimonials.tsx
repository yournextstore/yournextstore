import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Nathalie",
		quote:
			"As someone who's always struggled with dull skin, finding a product that truly delivers is like striking gold.",
	},
	{
		name: "Elena",
		quote:
			"This sunscreen isn't just another product in my skincare routine; it's an essential part of my daily skin protection.",
	},
	{
		name: "Andrea",
		quote:
			"From the moment I started using it, I noticed a significant difference in the brightness and clarity of my complexion.",
	},
];

export function Testimonials() {
	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
					Testimonials
				</h2>
				<div className="mt-12 grid gap-8 sm:grid-cols-3">
					{testimonials.map((t) => (
						<div key={t.name} className="rounded-sm border border-border bg-card p-8">
							<div className="mb-4 flex gap-1">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={`star-${t.name}-${i}`} className="h-4 w-4 fill-brand-lime text-brand-lime" />
								))}
							</div>
							<h3 className="mb-3 text-lg font-semibold">{t.name}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
