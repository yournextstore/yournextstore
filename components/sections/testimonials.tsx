import Image from "next/image";

const testimonials = [
	{
		quote: "I'm a big fan of Your Next Store and the quality is a great addition to my wardrobe!",
		name: "Carlos P.",
		title: "CEO at SmasherDasher",
		avatar: "/scraped-10.png",
	},
	{
		quote: "The store is amazing! One of a kind. It really helped me find exactly what I was looking for!",
		name: "Lynda F.",
		title: "Customer",
		avatar: "/scraped-11.png",
	},
	{
		quote: "Support is amazing, thanks a lot! I would definitely recommend this store to others.",
		name: "James M.",
		title: "Customer",
		avatar: "/scraped-12.png",
	},
	{
		quote: "Your Next Store is stunning and easy to browse! The customer support is outstanding as well!",
		name: "Holler Collection",
		title: "Customer",
		avatar: "/scraped-13.png",
	},
];

export function Testimonials() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			<h2 className="text-2xl sm:text-3xl font-medium text-center mb-3">Testimonials</h2>
			<p className="text-center text-muted-foreground mb-12">Share your stories with us</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{testimonials.map((t) => (
					<div key={t.name} className="text-center">
						<div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-5 bg-secondary">
							<Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="64px" />
						</div>
						<blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-4">
							&ldquo;{t.quote}&rdquo;
						</blockquote>
						<p className="text-sm font-medium">{t.name}</p>
						<p className="text-xs text-muted-foreground">{t.title}</p>
					</div>
				))}
			</div>
		</section>
	);
}
