import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongRightIcon } from "@/components/icons";
import { commerce } from "@/lib/commerce";

// Each square sits at its own height, as in the original's staggered Instagram strip; the
// third shows from 576px and the last two from 1024px.
const TILES: { image: string; className: string }[] = [
	{ image: "/images/pexels/gallery-sunglasses-pink.jpg", className: "flex pt-28 xs:pt-0 xs:pb-48" },
	{ image: "/images/pexels/gallery-beach-towel.jpg", className: "flex xs:pb-10" },
	{ image: "/images/pexels/gallery-sneakers-pink.jpg", className: "hidden pb-28 xs:flex" },
	{ image: "/images/pexels/gallery-pink-blazer.jpg", className: "hidden lg:flex" },
	{ image: "/images/pexels/gallery-cotton-sack.jpg", className: "hidden pb-38 lg:flex" },
];

async function getInstagramUrl() {
	"use cache";
	cacheLife("hours");
	const socials = await commerce.socialsGet().catch(() => null);
	return socials?.socials.instagram ?? null;
}

export async function Gallery() {
	const instagram = await getInstagramUrl();

	return (
		<section className="container-wide mb-12 pt-12">
			<div className="xs:-mb-6 xs:ml-[40%] xs:max-w-[60%]">
				<h2 className="mb-4 max-w-[26rem] text-display-1">
					{instagram ? "Follow us on Instagram for more updates" : "Small rituals, shared every day"}
				</h2>
				<div className="flex">
					{instagram ? (
						<a href={instagram} target="_blank" rel="noopener noreferrer" className="arrow-link">
							Follow us
							<ArrowLongRightIcon className="size-6" />
						</a>
					) : (
						<Link href="/about" className="arrow-link">
							Our story
							<ArrowLongRightIcon className="size-6" />
						</Link>
					)}
				</div>
			</div>
			<div className="-mx-4 flex">
				{TILES.map((tile) => (
					<div key={tile.image} className={`min-w-0 flex-1 flex-col px-2 xs:justify-end ${tile.className}`}>
						<div className="relative aspect-square w-full">
							<Image
								src={tile.image}
								alt=""
								fill
								sizes="(max-width: 1024px) 34vw, 20vw"
								className="object-cover"
							/>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
