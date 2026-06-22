import { Cookie, Heart, type LucideIcon, Wheat } from "lucide-react";

type Feature = {
	title: string;
	description: string;
	icon?: LucideIcon;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "Brown butter base",
		description: "We brown the butter low and slow until it smells like toffee, then fold it in.",
	},
	{
		title: "Real chocolate chunks",
		description: "Single-origin chocolate, hand-broken into uneven shards — never uniform chips.",
	},
	{
		title: "Hand-iced with love",
		description: "Every heart cookie is piped, dusted, and ribboned by hand in our small kitchen.",
	},
];

const defaultIcons = [Wheat, Cookie, Heart];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 pt-16 border-t border-[var(--border)]">
			<div className="text-center mb-12">
				<p className="text-xs font-bold tracking-[0.3em] text-[var(--candy)] uppercase">WHAT MAKES IT GOOD</p>
				<h2 className="mt-3 font-display italic text-[var(--maroon)] text-4xl sm:text-5xl tracking-tight">
					Baked the slow way
				</h2>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cream)] ring-1 ring-[var(--border)] transition-colors group-hover:bg-[var(--candy)]">
								<Icon className="h-7 w-7 text-[var(--candy)] transition-colors group-hover:text-white" />
							</div>
							<h3 className="mb-2 font-display italic text-2xl text-[var(--maroon)]">{feature.title}</h3>
							<p className="text-sm text-[var(--ink)]/70 leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
