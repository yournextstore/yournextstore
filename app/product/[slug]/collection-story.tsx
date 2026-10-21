import Image from "next/image";
import Link from "next/link";
import { YNSMedia } from "@/lib/yns-media";

type Collection = { name: string; slug: string; image: string | null };

/**
 * The original's collection call-to-action under the purchase panel: a heading with a
 * landscape photograph, a full-bleed wide photograph, then a portrait photograph beside a large
 * statement and an underlined link back to the collection. The collection's own image leads
 * when it has one; the theme's lifestyle photographs fill in the rest.
 */
export function CollectionStory({
	productName,
	collection,
}: {
	productName: string;
	collection: Collection;
}) {
	return (
		<section aria-label={`More from ${collection.name}`}>
			<div className="layout">
				<div className="col-span-full">
					<h2 className="mb-8 text-title-md md:text-title-2xl">Inspired by the Collection</h2>
					<div className="relative mb-8 aspect-[3/2] overflow-hidden bg-grayscale-50 md:mb-20">
						{collection.image ? (
							<YNSMedia
								src={collection.image}
								alt={collection.name}
								fill
								sizes="(max-width: 1400px) 100vw, 1368px"
								className="object-cover"
							/>
						) : (
							<Image
								src="/images/interiors/about-loveseat.jpg"
								alt="An ivory bouclé loveseat under a curtained window beside a ceramic table lamp"
								fill
								sizes="(max-width: 1400px) 100vw, 1368px"
								className="object-cover"
							/>
						)}
					</div>
				</div>
			</div>
			<div className="relative mb-8 aspect-[3/2] md:mb-20 md:aspect-[7/3]">
				<Image
					src="/images/interiors/story-wide-corner-sofa.jpg"
					alt="A long concrete-walled living room with a rounded grey corner sofa and an oak coffee table"
					fill
					sizes="100vw"
					className="object-cover"
				/>
			</div>
			<div className="layout">
				<div className="col-span-9 md:col-span-5">
					<div className="relative aspect-[3/4]">
						<Image
							src="/images/interiors/story-side-table.jpg"
							alt="A chalk ceramic table lamp and a vase with a dried branch on a travertine side table"
							fill
							sizes="(max-width: 768px) 75vw, 40vw"
							className="object-cover"
						/>
					</div>
				</div>
				<div className="col-span-full md:col-start-7 md:col-end-13">
					<h3 className="my-8 text-title-md md:mt-20 md:text-title-2xl">
						The {productName} is a study in quiet, lasting design.
					</h3>
					<p className="md:text-title-md">
						<Link href={`/collection/${collection.slug}`} className="link-underline">
							See more out of the ‘{collection.name}’ collection
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
