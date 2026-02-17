import Image from "next/image";

export function SimpleElegant() {
	return (
		<section className="relative overflow-hidden bg-navy min-h-[50vh] flex items-center">
			<Image src="/scraped-14.png" alt="" fill className="object-cover opacity-40" sizes="100vw" />
			<div className="absolute inset-0 bg-gradient-to-r from-[#3d4259]/80 to-[#3d4259]/40" />
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
				<div className="max-w-lg">
					<h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl italic text-white">
						Simple, elegant.
					</h2>
					<p className="mt-6 text-white/80 leading-relaxed">
						Our luxurious soft bags are designed to take you from weekday to weekend with a sassy edge. A
						cleverly disguised work bag that ensures your tactics always align for winning strategy.
					</p>
				</div>
			</div>
		</section>
	);
}
