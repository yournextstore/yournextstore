function LeafIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
			<path d="M5 19c8 0 14-6 14-14 0 0-5-1-9 3s-5 11-5 11z" strokeLinejoin="round" />
			<path d="M5 19c2-5 6-9 10-11" strokeLinecap="round" />
		</svg>
	);
}

function VialIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
			<path
				d="M9 3h6M10 3v9.5L6.5 18A3.5 3.5 0 0 0 9.5 21h5a3.5 3.5 0 0 0 3-3l-3.5-5.5V3"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function CrescentIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
			<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" strokeLinejoin="round" />
		</svg>
	);
}

const pillars = [
	{
		icon: <LeafIcon />,
		title: "Botanically grounded",
		body: "Formulations rooted in sage, chamomile, and mineral salts — chosen for what they do, not how they sound.",
	},
	{
		icon: <VialIcon />,
		title: "Clinically considered",
		body: "Developed alongside dental and dermatology partners. Every batch is tested for purity, gentle on enamel.",
	},
	{
		icon: <CrescentIcon />,
		title: "A slower ritual",
		body: "Designed to be lingered over. Soft textures, quiet scents, and packaging meant to live on the counter.",
	},
];

export function Ritual() {
	return (
		<section id="ritual" className="bg-background border-t border-border/60">
			<div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-20">
					{pillars.map((p) => (
						<div key={p.title} className="text-center md:text-left">
							<div className="text-foreground/70 inline-flex">{p.icon}</div>
							<h3 className="mt-6 font-serif text-2xl text-foreground">{p.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-[28ch] mx-auto md:mx-0">
								{p.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
