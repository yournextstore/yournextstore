import Image from "next/image";

const specs = [
	{ label: "Material", value: "Soft-touch silicone, recycled aluminum core" },
	{ label: "Diameter", value: "38mm" },
	{ label: "Weight", value: "12g" },
	{ label: "Wireless", value: "NFC, no battery, no bluetooth" },
	{ label: "Mount", value: "3M VHB adhesive base" },
	{ label: "Warranty", value: "2 years, no questions" },
];

export function ProductDetailGrid() {
	return (
		<section className="relative bg-background py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					<div className="relative aspect-square rounded-2xl overflow-hidden bg-card ring-1 ring-bone/8">
						<Image
							src="/scraped-4.jpg"
							alt="Product detail"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div
							aria-hidden
							className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-ember/10"
						/>
					</div>

					<div>
						<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">In the box</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-bone text-balance">
							Built from a small list of good materials.
						</h2>
						<p className="mt-4 text-muted-foreground max-w-md">
							Nothing extra. Every part of the tag exists for a reason — or it isn't there.
						</p>

						<dl className="mt-10 divide-y divide-border">
							{specs.map(({ label, value }) => (
								<div key={label} className="grid grid-cols-3 py-4 gap-4">
									<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
									<dd className="col-span-2 text-bone text-[15px]">{value}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
