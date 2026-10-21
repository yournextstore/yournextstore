import { cacheLife } from "next/cache";
import Link from "next/link";
import { carouselSlide } from "@/components/carousel";
import { getCategoryTiles, richTextToPlain } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";

type InspireTile = { id: string; href: string; title: string; text: string; image: string | null };

/** Blog posts when the store runs a blog (as in the original), otherwise its categories. */
async function getInspiration(): Promise<{
	title: string;
	more: { href: string; label: string };
	tiles: InspireTile[];
}> {
	"use cache";
	cacheLife("minutes");
	const me = await meGetCached().catch(() => null);
	if (me?.store.settings?.enabledTools?.blog) {
		const posts = await commerce.postBrowse({ active: true, limit: 3 }).catch(() => ({ data: [] }));
		if (posts.data.length > 0) {
			return {
				title: "Get inspired",
				more: { href: "/blog", label: "Read more" },
				tiles: posts.data.map((post) => ({
					id: post.id,
					href: `/blog/${post.slug}`,
					title: post.title,
					text: richTextToPlain(post.content),
					image: post.image,
				})),
			};
		}
	}
	const categories = await getCategoryTiles(3);
	return {
		title: "Get inspired",
		more: { href: "/products", label: "Shop all" },
		tiles: categories.map((category) => ({
			id: category.id,
			href: category.href,
			title: category.name,
			text:
				category.description ||
				`Browse ${category.name.toLowerCase()}, chosen for quality, comfort and everyday use.`,
			image: category.image,
		})),
	};
}

function Tile({ tile }: { tile: InspireTile }) {
	return (
		<Link href={tile.href} className="group flex h-full min-w-40 flex-col overflow-hidden bg-secondary">
			<span className="relative block h-56 overflow-hidden large:h-[17.5rem]">
				{tile.image && (
					<YNSMedia
						src={tile.image}
						alt=""
						fill
						sizes="(min-width: 900px) 440px, 73vw"
						className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
					/>
				)}
			</span>
			<span className="flex flex-col gap-1 p-4 sm:p-5">
				<span className="line-clamp-2 text-lead font-medium">{tile.title}</span>
				<span className="line-clamp-2 text-copy text-muted-foreground">{tile.text}</span>
			</span>
		</Link>
	);
}

export async function GetInspired() {
	const { title, more, tiles } = await getInspiration();
	if (tiles.length === 0) return null;

	return (
		<section className="shell section-y overflow-hidden">
			<div className="flex flex-col gap-6 sm:gap-12">
				<div className="flex items-center justify-between">
					<h2 className="text-heading-sm sm:text-heading-md">{title}</h2>
					<Link href={more.href} className="pill pill-tonal hidden large:inline-flex">
						{more.label}
					</Link>
				</div>
				<div className="hidden grid-cols-3 gap-2 large:grid">
					{tiles.map((tile) => (
						<Tile key={tile.id} tile={tile} />
					))}
				</div>
				<div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto large:hidden">
					{tiles.map((tile) => (
						<div key={tile.id} className={carouselSlide}>
							<Tile tile={tile} />
						</div>
					))}
				</div>
				<Link href={more.href} className="pill pill-tonal mx-auto large:hidden">
					{more.label}
				</Link>
			</div>
		</section>
	);
}
