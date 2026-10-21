import { getShelf } from "@/lib/catalog";
import { HeroSlider, type Slide } from "./hero-slider";

/** Full-bleed editorial slider; photographs are the original theme's (Unsplash). */
export async function Hero() {
	// The fullest categories make the best calls to action.
	const shelf = [...(await getShelf())].sort((a, b) => b.count - a.count);
	const [first, second, third] = shelf;
	const all = { href: "/products", label: "Shop all" };

	const slides: Slide[] = [
		{
			title: "Linen for slow seasons.",
			text: "Dresses, shirts and trousers in washed linen, cut simply and chosen for how they feel and last. No drops, no noise.",
			primary: { href: "/products", label: "Shop new in" },
			secondary: first ?? { href: "/about", label: "Our story" },
			note: "Considered pieces, slowly chosen.",
			image: { src: "/images/hero.jpg", alt: "A rail of ivory and sand garments on wooden hangers" },
		},
		{
			title: "The shirt you plan outfits around.",
			text: "One good piece in a natural fibre, worn often and kept for years. Shown plainly, without the theatre.",
			primary: second ? { href: second.href, label: `Shop ${second.label.toLowerCase()}` } : all,
			secondary: { href: "/about", label: "Our story" },
			note: "Fewer things, chosen better.",
			image: {
				src: "/images/hero-2.jpg",
				alt: "A shop window rail of linen and wool garments in earthy tones",
			},
		},
		{
			title: "Details that outlive trends.",
			text: "Linen, wool and cotton in quiet colours and simple shapes that stay right long after the season.",
			primary: third ? { href: third.href, label: `Shop ${third.label.toLowerCase()}` } : all,
			secondary: all,
			note: "Chosen to be kept.",
			image: {
				src: "/images/hero-3.jpg",
				alt: "A wooden rail of linen dresses and shirts in ivory, sand and rust by a curtained window",
			},
		},
	];

	return <HeroSlider slides={slides} />;
}
