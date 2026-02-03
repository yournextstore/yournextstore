type TrustBadge = {
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ title: "Free Shipping", description: "Orders over $500" },
	{ title: "10-Year Warranty", description: "Full coverage" },
	{ title: "30-Day Returns", description: "Hassle-free" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="pt-8 border-t border-zinc-200">
			<div className="grid grid-cols-3 gap-6">
				{badges.map((badge, index) => (
					<div key={badge.title} className="text-center">
						<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">
							{String(index + 1).padStart(2, "0")}
						</p>
						<p className="text-xs text-zinc-900 font-light">{badge.title}</p>
						<p className="text-[10px] text-zinc-400 mt-0.5">{badge.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
