import Image from "next/image";

const partners = [
	{
		name: "Partner 1",
		logo: "https://hackyeah.pl/wp-content/uploads/2024/10/photos.png",
	},
	{
		name: "Partner 2",
		logo: "https://hackyeah.pl/wp-content/uploads/2023/11/winners-btn.png",
	},
	{
		name: "Partner 3",
		logo: "https://hackyeah.pl/wp-content/uploads/2023/03/more-btn-new.png",
	},
] as const;

export function Partners() {
	return (
		<section id="partners" className="py-24 sm:py-32 relative overflow-hidden">
			{/* Background with gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

			{/* Background text - HackYeah style */}
			<div className="absolute inset-x-0 top-28 text-center pointer-events-none select-none overflow-hidden">
				<span className="text-7xl sm:text-9xl font-extrabold text-primary/5 uppercase tracking-widest">
					Partners
				</span>
			</div>

			{/* Decorative lines */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center mb-16">
					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
						Our{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
							Partners
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Trusted by leading brands and organizations worldwide
					</p>
				</div>

				<div className="flex flex-wrap justify-center items-center gap-12 sm:gap-16 lg:gap-20">
					{partners.map((partner) => (
						<div
							key={partner.name}
							className="group relative p-6 rounded-xl border border-transparent hover:border-primary/30 hover:bg-card/30 transition-all duration-300"
						>
							<div className="relative w-36 h-24 sm:w-44 sm:h-28 opacity-60 group-hover:opacity-100 transition-all duration-300 grayscale group-hover:grayscale-0">
								<Image
									src={partner.logo}
									alt={partner.name}
									fill
									className="object-contain"
									sizes="(max-width: 640px) 144px, 176px"
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
