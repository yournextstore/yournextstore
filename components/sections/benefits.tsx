import Image from "next/image";

const benefits = [
	{
		title: "Clean Ingredients",
		body: "Plant-based oils, real botanicals, and zero synthetic mystery juice — ever.",
		image: "/scraped-1.jpg",
	},
	{
		title: "Iconic Scents",
		body: "Mood-shifting fragrance built from essential oils. Designed to be unforgettable.",
		image: "/scraped-2.jpg",
	},
	{
		title: "Cold-Pressed, Small Batch",
		body: "Hand-poured in small runs so every bar smells like the day it was made.",
		image: "/scraped-3.jpg",
	},
];

export function Benefits() {
	return (
		<section className="bg-cream-gradient">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
					{benefits.map((b) => (
						<div key={b.title} className="flex flex-col items-center text-center">
							<div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-[#f2c9a6] ring-8 ring-[#fdf6ee] shadow-[0_20px_40px_-15px_rgba(26,26,46,0.25)]">
								<Image src={b.image} alt={b.title} fill sizes="200px" className="object-cover" />
							</div>
							<h3 className="mt-6 font-display text-2xl sm:text-3xl text-[#1a1a2e]">{b.title}</h3>
							<p className="mt-3 text-[#5c5b78] leading-relaxed max-w-xs">{b.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
