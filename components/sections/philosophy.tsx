import Image from "next/image";

const notes = [
	{ name: "Vetiver", origin: "Haiti" },
	{ name: "Bergamot", origin: "Calabria" },
	{ name: "Cedar", origin: "Atlas" },
	{ name: "Resin", origin: "Oman" },
];

export function Philosophy() {
	return (
		<section className="relative realm-wood-gradient realm-noise text-[#f2ebdd]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden rounded-sm">
						<Image
							src="/scraped-4.jpg"
							alt="Raw materials &mdash; vetiver, bergamot peel, cedar shavings"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-[#3e2a1c]/40 to-transparent" />
					</div>

					<div className="lg:col-span-6">
						<p className="text-[10px] tracking-[0.45em] uppercase text-[#f2ebdd]/65 font-light">
							The Composition
						</p>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.015em]">
							Twelve ingredients.
							<br />
							<span className="italic font-light">Nothing in disguise.</span>
						</h2>
						<p className="mt-7 text-[15px] leading-[1.85] text-[#f2ebdd]/80 max-w-md">
							We work from a small, named palette &mdash; growers we visit, distillers we know by hand. The
							formula reads like a recipe, not a chemistry sheet.
						</p>

						<dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-md">
							{notes.map((n) => (
								<div
									key={n.name}
									className="flex items-baseline justify-between border-b border-[#f2ebdd]/15 pb-3"
								>
									<dt className="font-serif text-xl tracking-[-0.01em]">{n.name}</dt>
									<dd className="text-[11px] tracking-[0.22em] uppercase text-[#f2ebdd]/55">{n.origin}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
