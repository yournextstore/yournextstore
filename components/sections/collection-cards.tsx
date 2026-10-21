import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { richTextToPlain } from "@/lib/display";
import { pickEditorial } from "@/lib/editorial";
import { cn } from "@/lib/utils";

async function getCollectionCards() {
	"use cache";
	cacheLife("minutes");
	const [collections, categories] = await Promise.all([
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] })),
	]);
	// A manual collection without members would open an empty page.
	const sections = [
		...collections.data
			.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
			.map((c) => ({
				id: c.id,
				name: c.name,
				href: `/collection/${c.slug}`,
				description: richTextToPlain(c.description),
			})),
		...categories.data
			.filter((category) => !category.parentId)
			.map((category) => ({
				id: category.id,
				name: category.name,
				href: `/category/${category.slug}`,
				description: richTextToPlain(category.description),
			})),
	];
	// Whole rows only: three or six cards once there are enough, so no card sits alone.
	const shown = sections.slice(0, sections.length >= 6 ? 6 : sections.length >= 3 ? 3 : sections.length);
	const images = pickEditorial(shown.map((section) => section.name));
	return shown.map((section, index) => ({ ...section, image: images[index] ?? null }));
}

/** Shop sections as the original's product cards: photo, then a name/action row. */
export async function CollectionCards() {
	const cards = await getCollectionCards();
	if (cards.length === 0) return null;

	return (
		<section aria-labelledby="collections-title" className="container pb-16 sm:pb-20">
			<h2 id="collections-title" className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
				Explore the shop
			</h2>
			<div className={cn("grid gap-12", cards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
				{cards.map((card) => (
					<Link
						key={card.id}
						href={card.href}
						className="group flex flex-col overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
					>
						<div className="relative aspect-[4/3] overflow-hidden bg-[#e2d8c9]">
							{card.image ? (
								<Image
									src={card.image}
									alt=""
									fill
									sizes="(min-width: 1280px) 400px, (min-width: 768px) 30vw, calc(100vw - 48px)"
									className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								/>
							) : null}
						</div>
						<div className="flex flex-1 flex-col gap-1 px-5 py-6 text-zinc-700">
							<span className="flex items-center justify-between gap-4">
								<span className="font-bold group-hover:underline">{card.name}</span>
								<ArrowRight className="h-5 w-5 shrink-0 text-emerald-900" aria-hidden />
							</span>
							{card.description ? (
								<span className="line-clamp-2 text-sm text-gray-600">{card.description}</span>
							) : null}
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
