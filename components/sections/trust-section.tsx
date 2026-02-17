import { Droplets, Heart, Leaf, ShieldCheck } from "lucide-react";

const badges = [
	{ icon: Droplets, label: "FOR ALL SKIN TYPES" },
	{ icon: Heart, label: "NOT TESTED ON ANIMALS" },
	{ icon: ShieldCheck, label: "HYPOALLERGENIC" },
	{ icon: Leaf, label: "FREE FROM PARABENS" },
];

export function TrustSection() {
	return (
		<section className="bg-secondary py-16 sm:py-20">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<h2 className="text-center font-heading text-2xl font-bold tracking-tight sm:text-3xl">
					We acknowledge the trust you place in us when you choose our brand for your skincare.
				</h2>
				<div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
					{badges.map((badge) => (
						<div key={badge.label} className="flex flex-col items-center gap-3 text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-sage/20">
								<badge.icon className="h-6 w-6 text-brand-sage" />
							</div>
							<span className="text-xs font-semibold uppercase tracking-wider text-foreground">
								{badge.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
