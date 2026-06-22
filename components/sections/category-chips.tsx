import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { previewHref } from "@/lib/demo-products";

const DEFAULT_CHIPS = [
	{ name: "Living", slug: "living", image: "/scraped-1.jpg" },
	{ name: "Kitchen", slug: "kitchen", image: "/scraped-2.jpg" },
	{ name: "Bath", slug: "bath", image: "/scraped-3.jpg" },
	{ name: "Lighting", slug: "lighting", image: "/scraped-4.jpg" },
	{ name: "Outdoor", slug: "outdoor", image: "/scraped-5.jpg" },
	{ name: "Atelier", slug: "atelier", image: "/scraped-0.jpg" },
];

type CategoryChipsProps = {
	isPreview?: boolean;
};

export async function CategoryChips({ isPreview = false }: CategoryChipsProps) {
	"use cache";
	cacheLife("hours");

	const collections = isPreview ? { data: [] } : await commerce.collectionBrowse({ limit: 6 });

	const chips =
		collections.data.length > 0
			? collections.data.map((c, i) => ({
					name: c.name,
					slug: c.slug,
					image: c.image ?? DEFAULT_CHIPS[i % DEFAULT_CHIPS.length].image,
				}))
			: DEFAULT_CHIPS;

	return (
		<section className="bg-cream py-12 sm:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-8">
					<div>
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-2">Browse</p>
						<h2 className="font-serif text-3xl sm:text-4xl text-walnut tracking-tight">By room</h2>
					</div>
					<YnsLink
						href={previewHref("/products", isPreview)}
						className="hidden sm:block text-[11px] uppercase tracking-[0.22em] text-espresso/70 hover:text-espresso underline-offset-4 hover:underline"
					>
						All rooms
					</YnsLink>
				</div>

				<div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
					<ul className="flex gap-4 sm:gap-6 min-w-min pb-2">
						{chips.map((chip) => (
							<li key={chip.slug} className="shrink-0">
								<YnsLink
									prefetch={"eager"}
									href={previewHref(`/collection/${chip.slug}`, isPreview)}
									className="group block w-[150px] sm:w-[170px]"
								>
									<div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-md bg-sand">
										<Image
											src={chip.image}
											alt={chip.name}
											fill
											sizes="170px"
											className="object-cover transition-transform duration-700 group-hover:scale-105"
										/>
										<div
											aria-hidden="true"
											className="absolute inset-0 bg-gradient-to-t from-walnut/30 to-transparent"
										/>
									</div>
									<p className="mt-3 text-center font-serif text-lg text-walnut">{chip.name}</p>
								</YnsLink>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
