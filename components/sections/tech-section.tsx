import Image from "next/image";

export function TechSection() {
	return (
		<section className="py-20 sm:py-28 bg-secondary/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: Product image */}
					<div className="flex justify-center">
						<div className="relative w-[300px] h-[400px]">
							<Image
								src="/scraped-9.png"
								alt="Thermal bottle technology"
								fill
								className="object-contain"
								sizes="300px"
							/>
						</div>
					</div>

					{/* Right: Tech specs */}
					<div>
						<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
							New Technology
						</span>

						<div className="mt-8 grid grid-cols-2 gap-8">
							<div>
								<span className="text-5xl font-light text-foreground">24h</span>
								<p className="mt-2 text-sm text-muted-foreground">Keeps liquid cold for 24 hours</p>
							</div>
							<div>
								<span className="text-5xl font-light text-foreground">12h</span>
								<p className="mt-2 text-sm text-muted-foreground">Keeps liquid hot up to 12 hours</p>
							</div>
						</div>

						<div className="mt-12">
							<h3 className="text-2xl font-light text-foreground">
								Available in multiple capacities{" "}
								<span className="text-muted-foreground">(350ml, 500ml, 1L)</span> to match your daily rhythm.
							</h3>
						</div>

						<p className="mt-6 text-sm text-muted-foreground">Easily switch from straw mode to cup mode</p>
					</div>
				</div>
			</div>
		</section>
	);
}
