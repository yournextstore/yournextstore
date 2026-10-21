import { ArrowDownCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { ProductCard } from "@/components/product-card";
import { getHomeShelves } from "@/lib/catalog";
import { HERO_COVER, MOSAIC } from "@/lib/editorial";
import { getShopInfo } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Hide cards so a row of five stays one row: 4 on phones, 3 at sm, 4 at md, 5 at lg (original BookRow). */
export function rowCardClass(index: number, count: number) {
	if (count >= 5) {
		if (index === 4) return "max-sm:hidden md:max-lg:hidden";
		if (index === 1 || index === 3) return "sm:max-md:hidden";
	}
	if (count === 4 && index === 3) return "sm:max-md:hidden";
	return undefined;
}

export async function HomeHero() {
	const shop = await getShopInfo();

	return (
		<section className="shelf-container flex flex-col gap-y-4 py-6 md:flex-row-reverse md:gap-x-4 lg:py-14">
			<div className="relative flex flex-1 items-center justify-center p-4 lg:p-0">
				{/* A lidded cup seen from above, as in the original's flat lay. */}
				<div
					aria-hidden="true"
					className="absolute top-[6%] left-[10%] aspect-square w-[26%] rounded-full bg-[radial-gradient(circle_at_45%_40%,#fff_0%,#fff_46%,#e7eeee_47%,#fff_52%,#f2f6f6_70%,#dfe7e6_100%)] shadow-[8px_18px_28px_-6px_rgb(0_0_0/0.35)] md:top-[6%] md:left-[4%]"
				/>
				<div className="relative w-[46%] max-w-[19rem] rotate-[-24deg] drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] md:w-[54%]">
					<BookCover
						src={HERO_COVER.src}
						alt={HERO_COVER.alt}
						priority
						sizes="(min-width: 768px) 304px, 46vw"
						className="h-auto w-full rounded-r-md"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-x-[10%] bottom-[9%] rounded-sm bg-[#2b2b2b]/80 px-3 py-2 text-center"
					>
						<span className="block font-serif text-[clamp(0.9rem,3.6vw,1.35rem)] font-semibold leading-tight text-white">
							{shop.storeName}
						</span>
						<span className="mt-1 hidden truncate text-[0.55rem] lg:block uppercase tracking-[0.2em] text-white">
							The collected edition
						</span>
					</div>
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-y-4 md:justify-center lg:justify-end lg:gap-y-8">
				<h1 className="font-serif text-4xl font-semibold leading-tight lg:text-5xl xl:text-6xl xl:leading-tight">
					Best Place to Find <br />
					Your Favourite <br />
					Books.
				</h1>
				<p className="xl:text-lg">
					Novels, nature writing, cookery and picture books, chosen by people who read them. Wander the
					shelves and find the book you will want to talk about next.
				</p>
				<div>
					<a href="#shelves" className="btn-outline-shelf px-4 py-2 text-lg font-semibold">
						Browse
						<ArrowDownCircle aria-hidden="true" className="h-5 w-5 animate-bounce" strokeWidth={2} />
					</a>
				</div>
				{shop.socials.length > 0 ? (
					<ul className="flex flex-wrap gap-x-5 gap-y-2">
						{shop.socials.map((social) => (
							<li key={social.href}>
								<a href={social.href} target="_blank" rel="noreferrer" className="link-dashed">
									{social.label}
								</a>
							</li>
						))}
					</ul>
				) : null}
				<ul className="mt-8 flex divide-x divide-foreground lg:mt-12">
					<li className="pr-2">Staff Picks</li>
					<li className="px-2">Handpicked Books</li>
					<li className="pl-2">Secure Checkout</li>
				</ul>
			</div>
		</section>
	);
}

function SeeAll({ href, title, bottom = false }: { href: string; title: string; bottom?: boolean }) {
	return (
		<Link
			href={href}
			aria-label={`See All ${title}`}
			className={cn("items-center gap-x-1 font-medium hover:underline", bottom ? "flex" : "hidden md:flex")}
		>
			See All
			<ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
		</Link>
	);
}

export async function HomeShelves() {
	const shelves = await getHomeShelves();
	return (
		<div id="shelves" className="shelf-container scroll-mt-20 py-6 md:py-10">
			{shelves.map((shelf, shelfIndex) => (
				<section key={shelf.href} className="pb-10 md:pb-14">
					<div className="flex items-baseline justify-between">
						<h2 className="font-serif text-2xl font-medium">{shelf.title}</h2>
						<SeeAll href={shelf.href} title={shelf.title} />
					</div>
					<div className="shelf-grid my-4">
						{shelf.products.map((product, index) => (
							<ProductCard
								key={product.id}
								product={product}
								priority={shelfIndex === 0 && index < 2}
								className={rowCardClass(index, shelf.products.length)}
							/>
						))}
					</div>
					<div className="mt-6 flex justify-center md:hidden">
						<SeeAll href={shelf.href} title={shelf.title} bottom />
					</div>
				</section>
			))}
		</div>
	);
}

/** The original's "# Follow Us on Instagram" band, on bundled editorial photos. */
export async function HomeMosaic() {
	const shop = await getShopInfo();
	const instagram = shop.socials.find((s) => s.label === "Instagram");
	const tiles = MOSAIC;

	return (
		<section className="bg-muted py-10 md:py-12">
			<div className="shelf-container">
				<h2 className="mb-6 text-center font-serif text-3xl font-semibold md:mb-8 md:text-4xl">
					{instagram ? (
						<a href={instagram.href} target="_blank" rel="noreferrer" className="hover:underline">
							# Follow Us on Instagram
						</a>
					) : (
						"# A Look Around the Shop"
					)}
				</h2>
				<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
					{tiles.map((tile, i) => (
						<li
							key={`${tile.src}-${i}`}
							className={i === 4 ? "max-md:hidden" : i === 3 ? "sm:max-md:hidden" : undefined}
						>
							<Link href="/products" className="group relative block aspect-square overflow-hidden">
								<YNSMedia
									src={tile.src}
									alt={tile.alt}
									fill
									sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
