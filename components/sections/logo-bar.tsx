const logos = [
	{ name: "Folio", id: "folio" },
	{ name: "Studio", id: "studio" },
	{ name: "Archetype", id: "archetype" },
	{ name: "Motion", id: "motion" },
];

export function LogoBar() {
	return (
		<section className="border-b border-border bg-background">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
				<div className="flex items-center justify-center gap-12 sm:gap-20 flex-wrap">
					{logos.map((logo) => (
						<span
							key={logo.id}
							className="text-lg sm:text-xl font-heading text-muted-foreground/40 tracking-wider uppercase"
						>
							{logo.name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
