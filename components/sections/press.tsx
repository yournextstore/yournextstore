const outlets = ["BON APPÉTIT", "FOOD & WINE", "VEGNEWS", "THE SPRUCE EATS", "EATER", "WELL+GOOD"];

export function Press() {
	const loop = [...outlets, ...outlets];
	return (
		<section className="bg-cream-paper py-12 border-y border-forest/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-center font-display uppercase tracking-[0.32em] text-forest/50 text-xs mb-8">
					As featured in
				</p>
				<div className="overflow-hidden mask-fade">
					<div className="flex w-max marquee-track gap-14 items-center">
						{loop.map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-display uppercase tracking-[0.25em] text-forest/45 text-lg sm:text-2xl whitespace-nowrap"
							>
								{name}
							</span>
						))}
					</div>
				</div>
			</div>
			<style>{`.mask-fade{mask-image:linear-gradient(to right,transparent 0%,black 12%,black 88%,transparent 100%);-webkit-mask-image:linear-gradient(to right,transparent 0%,black 12%,black 88%,transparent 100%);}`}</style>
		</section>
	);
}
