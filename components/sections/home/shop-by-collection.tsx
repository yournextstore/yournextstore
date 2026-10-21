import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getCollections, PHOTOS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * "Shop BY collection": navy-graded photo cards with an uppercase title and arrow beneath, for the
 * store's collections and categories (then "All products"), each over a bundled Pexels photo.
 */
export async function ShopByCollection() {
	const [collections, categories] = await Promise.all([getCollections(), getCategories()]);
	const links = [
		...collections.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
	];
	const cards = [...links.slice(0, 3), { href: "/products", label: "All products" }]
		.slice(0, PHOTOS.cards.length)
		.map((card, index) => ({ ...card, image: PHOTOS.cards[index] ?? null }));
	if (cards.length < 2) return null;

	return (
		<section
			aria-labelledby="shop-by-collection"
			className="mx-auto max-w-[78rem] px-4 py-16 sm:px-6 lg:py-20"
		>
			<h2
				id="shop-by-collection"
				className="section-title mb-12 text-center text-[2rem] text-ink lg:mb-14 lg:text-heading-xl"
			>
				Shop <span className="stroke-word">the</span> Range
			</h2>
			<ul
				className={cn(
					"grid grid-cols-1 gap-5 xs:grid-cols-2",
					cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
				)}
			>
				{cards.map((card) => (
					<li key={card.href}>
						<Link
							href={card.href}
							className="group flex h-full flex-col overflow-hidden rounded-lg bg-card shadow-[0_2px_14px_rgb(4_38_80/0.1)]"
						>
							<span className="relative block aspect-[4/3] overflow-hidden bg-hero">
								{card.image && (
									<Image
										src={card.image}
										alt=""
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								)}
								<span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(23_32_59/0.05),rgb(23_32_59/0.45))] mix-blend-multiply" />
							</span>
							<span className="flex flex-1 items-start justify-between gap-4 px-4 pt-5 pb-10">
								<span className="font-montserrat text-lg leading-tight font-bold text-ink uppercase">
									{card.label}
								</span>
								<ArrowRight
									className="mt-0.5 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
									aria-hidden="true"
								/>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
