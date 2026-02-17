import Image from "next/image";

export function BeautifulDetails() {
	return (
		<section className="bg-navy py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl italic text-white text-center mb-2">
					Beautiful
				</h2>
				<p className="text-center text-white/60 text-sm tracking-widest uppercase mb-12">details</p>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="relative aspect-square overflow-hidden group">
						<Image
							src="/scraped-8.png"
							alt="Detail"
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 33vw"
						/>
					</div>
					<div className="relative aspect-square overflow-hidden group">
						<Image
							src="/scraped-9.png"
							alt="Detail"
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 33vw"
						/>
					</div>
					<div className="relative aspect-square overflow-hidden group">
						<Image
							src="/scraped-10.png"
							alt="Detail"
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 33vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
