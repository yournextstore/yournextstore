import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { getBrowseTiles, getCollectionTiles, type ShowcaseTile } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The collections rail. `size="lg"` is the home page's: tall portrait cards with a large
 * title and a grey description, plus a "View All" button. `size="sm"` is the shop page's
 * compact row of narrower cards with the name only.
 */
export async function CollectionsCarousel({
	heading,
	size = "lg",
	className,
}: {
	heading?: string;
	size?: "lg" | "sm";
	className?: string;
}) {
	if (size === "lg") {
		// Home: a store with a single collection gets it as one feature instead of a lone-card rail.
		const collections = await getCollectionTiles(12);
		const [only] = collections;
		if (collections.length === 1 && only) return <CollectionFeature tile={only} className={className} />;
	}
	const { tiles, mixed } = await getBrowseTiles(12);
	if (tiles.length < 2) return null;
	const title = heading ?? (mixed ? "Explore the Shop" : "Collections");

	return (
		<Carousel
			label={title}
			className={className}
			heading={<h2 className="text-title-md md:text-title-2xl">{title}</h2>}
			button={
				size === "lg" ? (
					<Link
						href="/products"
						className="inline-flex h-8 items-center rounded-xs bg-foreground px-4 text-body-xs text-background transition-colors hover:bg-grayscale-800 md:h-auto md:px-6 md:text-body"
					>
						View All
					</Link>
				) : undefined
			}
		>
			{tiles.map((tile) => (
				<Link
					key={tile.id}
					href={tile.href}
					className={cn(
						"group w-[70%] shrink-0 snap-start sm:w-[60%] lg:w-full",
						size === "lg" ? "max-w-124" : "max-w-72",
					)}
				>
					<div
						className={cn(
							"relative aspect-[3/4] w-full overflow-hidden bg-grayscale-50",
							size === "lg" ? "mb-4 md:mb-10" : "mb-4 md:mb-6",
						)}
					>
						{tile.image && (
							<YNSMedia
								src={tile.image}
								alt=""
								fill
								sizes={size === "lg" ? "(max-width: 1024px) 70vw, 496px" : "(max-width: 1024px) 70vw, 288px"}
								className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
							/>
						)}
					</div>
					{size === "lg" ? (
						<>
							<h3 className="mb-2 md:mb-4 md:text-title-lg">{tile.name}</h3>
							{tile.description && (
								<p className="text-body-xs text-grayscale-500 md:text-title-md">{tile.description}</p>
							)}
						</>
					) : (
						<h3>{tile.name}</h3>
					)}
				</Link>
			))}
		</Carousel>
	);
}

/** One collection as a wide photograph beside its name, description and a link. */
function CollectionFeature({ tile, className }: { tile: ShowcaseTile; className?: string }) {
	return (
		<section aria-label={tile.name} className={cn("layout", className)}>
			<h2 className="col-span-full mb-8 text-title-md md:mb-15 md:text-title-2xl">Collections</h2>
			<Link
				href={tile.href}
				className="group relative col-span-full aspect-[4/3] overflow-hidden bg-grayscale-50 md:col-span-7"
			>
				{tile.image && (
					<YNSMedia
						src={tile.image}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 58vw"
						className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
					/>
				)}
			</Link>
			<div className="col-span-full flex flex-col justify-end max-md:mt-6 md:col-start-9 md:col-end-13">
				<h3 className="mb-2 text-title-md md:mb-4 md:text-title-2xl">{tile.name}</h3>
				{tile.description && (
					<p className="mb-6 text-grayscale-500 md:mb-10 md:text-title-md">{tile.description}</p>
				)}
				<p className="md:text-title-md">
					<Link href={tile.href} className="link-underline">
						Shop the collection
					</Link>
				</p>
			</div>
		</section>
	);
}
