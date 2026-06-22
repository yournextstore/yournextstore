import Image from "next/image";

export function AboutSection() {
	return (
		<section className="bg-white py-12 sm:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{/* Store description */}
					<div>
						<h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Your Next Store</h2>
						<p className="text-muted-foreground leading-relaxed">
							Welcome to Your Next Store! If you are interested in natural wellness products, you have come to
							the right place. Here you will find everything you need to take care of your skin, hair, health,
							and wellbeing. Explore our premium selection of natural products!
						</p>
					</div>

					{/* Product highlights */}
					<div>
						<h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
							Premium Quality Natural Products
						</h3>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-4 text-muted-foreground leading-relaxed">
								<p>
									Our store offers the highest quality natural products from renowned manufacturers. You will
									find premium herbal teas, natural balms, therapeutic creams, and much more. Our herbal teas
									are known for their numerous positive properties — they strengthen the immune system, help
									reduce pain, improve mood, and aid in sleep.
								</p>
								<p>
									For those suffering from joint pain or skin conditions, we recommend our natural balms and
									creams. These specialist products not only reduce pain — they also have anti-inflammatory
									and soothing effects. Our products contain high concentrations of essential fatty acids and
									omega compounds in ideal proportions.
								</p>
								<p>
									Natural oils are our flagship products with the widest spectrum of applications — they
									soothe pain, regulate wellness, prevent discomfort, and calm the senses. Their healing
									properties have been scientifically confirmed and are increasingly used in therapeutic
									applications.
								</p>
							</div>
							<div className="relative rounded-xl overflow-hidden shadow-md">
								<Image
									src="/scraped-13.jpg"
									alt="Your Next Store — Natural Products"
									width={400}
									height={500}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
