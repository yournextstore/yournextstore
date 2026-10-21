import { PhotoTile } from "@/components/photo-tile";
import { getHomeEditorial, type ShowcaseTile } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";

// Editorial frames are bundled generated photographs (see NOTICE.md); the shop-by tiles and every
// product surface use the store's own images.
const PHOTO = {
	hero: [
		"/images/pexels/hero-crossing.jpg",
		"/images/pexels/hero-walk.jpg",
		"/images/pexels/hero-street.jpg",
	],
	banner: "/images/pexels/banner-rack.jpg",
	storyA: "/images/pexels/story-shoe.jpg",
	storyB: "/images/pexels/story-bag.jpg",
	frame: "/images/pexels/frame-sidewalk.jpg",
	closeA: "/images/pexels/close-sunglasses.jpg",
	closeB: "/images/pexels/close-sneakers.jpg",
	closeC: "/images/pexels/close-coat.jpg",
};

// Column counts per tile count, so a short row never leaves a hole or a lone tile.
const FAMILY_GRID: Record<number, string> = {
	2: "grid grid-cols-2",
	3: "grid grid-cols-1 sm:grid-cols-3",
	4: "grid grid-cols-2 md:grid-cols-4",
};

/**
 * The home page is the original's sequence of full-bleed photographic bands: a black-and-white
 * hero under the header, a full-width banner, a row of product families, a two-up story spread,
 * one full-bleed frame and a three-up close. All of it is cached and rendered without Suspense,
 * so the page prerenders whole.
 */
export async function HomeSections() {
	const [{ categories, collections }, { storeName, storeDescription }] = await Promise.all([
		getHomeEditorial(),
		getStoreSeo(),
	]);
	const featured = collections[0] ?? null;
	const familyRow: ShowcaseTile[] = [...categories, ...collections].slice(0, 4);
	const giftTile = collections.find((tile) => !familyRow.includes(tile)) ?? null;

	return (
		<>
			{/* 1 · Hero: the header lies over it (globals.css, [data-hero]). */}
			<section data-hero className="relative h-svh min-h-[32rem] overflow-hidden bg-panel">
				<h1 className="sr-only">{storeName}</h1>
				<div className="grid h-full grid-cols-1 md:grid-cols-3">
					{PHOTO.hero.map((image, i) => (
						<div key={image} className={i === 0 ? "relative" : "relative max-md:hidden"}>
							<YNSMedia
								src={image}
								alt=""
								fill
								priority
								sizes="(max-width: 767px) 100vw, 34vw"
								className="object-cover grayscale contrast-[1.05]"
							/>
						</div>
					))}
				</div>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-black/45 to-transparent"
				/>
			</section>

			{/* 2 · The banner (the original's discovery set): the first collection, or the whole shop. */}
			<PhotoTile
				image={PHOTO.banner}
				href={featured?.href ?? "/products"}
				sizes="100vw"
				className="h-svh min-h-[30rem]"
				caption={featured ? <>{featured.name} · Shop the collection</> : "Shop all"}
			/>

			{/* 3 · Product families, four across. */}
			{familyRow.length > 1 && (
				<section aria-label="Shop by family" className={FAMILY_GRID[familyRow.length]}>
					{familyRow.map((tile) => (
						<PhotoTile
							key={tile.id}
							image={tile.image}
							href={tile.href}
							caption={tile.name}
							sizes="(max-width: 767px) 50vw, 25vw"
							className="aspect-[3/4] md:aspect-auto md:h-[70vh] md:min-h-[26rem]"
						/>
					))}
				</section>
			)}

			{/* 4 · Story spread: a captioned half and a silent half. */}
			<section aria-label="Our story" className="grid md:grid-cols-2">
				<PhotoTile
					image={PHOTO.storyA}
					href="/about"
					caption={<>Stories 01. About {storeName}</>}
					sizes="(max-width: 767px) 100vw, 50vw"
					className="aspect-[4/5] md:aspect-auto md:h-svh md:min-h-[32rem]"
				/>
				<PhotoTile
					image={PHOTO.storyB}
					sizes="(max-width: 767px) 100vw, 50vw"
					className="aspect-[4/5] max-md:hidden md:aspect-auto md:h-svh md:min-h-[32rem]"
				/>
			</section>

			{/* 5 · One full-bleed frame, in black and white, carrying the store's own line. */}
			<PhotoTile
				image={PHOTO.frame}
				href="/products"
				mono
				sizes="100vw"
				className="h-[80svh] min-h-[28rem] md:h-svh"
				caption={<span className="block max-w-xl">{storeDescription ?? `Shop all of ${storeName}`}</span>}
			/>

			{/* 6 · Three-up close, the middle frame captioned like the original's "Gift". */}
			<section aria-label="More to explore" className="grid grid-cols-2 md:grid-cols-3">
				<PhotoTile
					image={PHOTO.closeA}
					sizes="(max-width: 767px) 50vw, 33vw"
					className="aspect-[3/4] max-md:hidden md:aspect-auto md:h-[80vh] md:min-h-[28rem]"
				/>
				<PhotoTile
					image={PHOTO.closeB}
					href={giftTile?.href ?? "/products?sort=newest"}
					caption={giftTile?.name ?? "New in"}
					sizes="(max-width: 767px) 50vw, 33vw"
					className="aspect-[3/4] md:aspect-auto md:h-[80vh] md:min-h-[28rem]"
				/>
				<PhotoTile
					image={PHOTO.closeC}
					href="/products"
					caption="Shop all"
					sizes="(max-width: 767px) 50vw, 33vw"
					className="aspect-[3/4] md:aspect-auto md:h-[80vh] md:min-h-[28rem]"
				/>
			</section>
		</>
	);
}
