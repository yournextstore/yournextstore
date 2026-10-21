import Image from "next/image";
import Link from "next/link";
import { capitalize, getCatalogCategories, getProductCount } from "@/lib/catalog";
import blazer from "@/public/images/pexels/hero-blazer.jpg";
import coat from "@/public/images/pexels/hero-coat.jpg";

// Editorial photographs (Pexels, see NOTICE.md): two outfits hung on a wall, as a diptych.
const PANES = [
	{ src: blazer, alt: "A beige blazer and a handbag hanging on a wall" },
	{ src: coat, alt: "" },
];

/** Penny's split hero: copy on gray-50 at the left, photography filling the right half. */
export async function Hero({ description }: { description: string | null }) {
	const [categories, count] = await Promise.all([getCatalogCategories(), getProductCount()]);
	const top = categories[0];

	return (
		<div className="relative bg-gray-50 pb-4 lg:pb-0">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
				<div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
					<div className="lg:pr-16">
						<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
							Pieces worth keeping
						</h1>
						<p className="mt-4 text-xl text-gray-600">
							{description ?? `${count} products chosen with care, from everyday staples to small finds.`}
						</p>
						<div className="mt-6">
							<Link
								href={top ? `/category/${top.slug}` : "/products"}
								className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-hover focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
							>
								{top ? `Shop ${capitalize(top.name)}` : "Shop all products"}
							</Link>
						</div>
					</div>
				</div>
				<div className="grid h-80 w-full grid-cols-2 sm:h-96 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2">
					{PANES.map((image) => (
						<div key={image.src.src} className="relative h-full">
							<Image
								src={image.src}
								alt={image.alt}
								placeholder="blur"
								fill
								priority
								sizes="(min-width: 1024px) 25vw, 50vw"
								className="object-cover"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
