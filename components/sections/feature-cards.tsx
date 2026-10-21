import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreInfo } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { formatDate } from "@/lib/dates";
import { plainText } from "@/lib/display";
import { CARD_IMAGES, hasMembers } from "@/lib/editorial";
import { YNSMedia } from "@/lib/yns-media";

type Entry = { href: string; title: string; image: string | null; footer: string };

/**
 * The original's closing row of three blog cards. Stores with the blog on show their latest posts;
 * otherwise the row shows three collections, or failing that three top-level categories, in the same card.
 */
async function getEntries(): Promise<{ heading: string; entries: Entry[] }> {
	"use cache";
	cacheLife("minutes");
	const info = await getStoreInfo();
	if (info.blog) {
		const posts = await commerce.postBrowse({ active: true, limit: 3 }).catch(() => ({ data: [] }));
		if (posts.data.length > 0) {
			return {
				heading: "From the blog",
				entries: posts.data.map((post) => ({
					href: `/blog/${post.slug}`,
					title: post.title,
					image: post.image ?? null,
					footer: formatDate(post.publishedAt ?? post.createdAt),
				})),
			};
		}
	}
	const collections = await commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] }));
	const filled = collections.data.filter(hasMembers);
	if (filled.length >= 3) {
		return {
			heading: "Collections",
			entries: filled.slice(0, 3).map((collection, i) => ({
				href: `/collection/${collection.slug}`,
				title: collection.name,
				image: collection.image ?? CARD_IMAGES[i % CARD_IMAGES.length] ?? null,
				footer: plainText(collection.description) || "Collection",
			})),
		};
	}
	// Too few collections for the row of three: the store's top-level categories instead.
	const categories = await commerce.categoriesBrowse({ limit: 50 }).catch(() => ({ data: [] }));
	const top = categories.data.filter((category) => !category.parentId).slice(0, 3);
	return {
		heading: "Categories",
		entries:
			top.length === 3
				? top.map((category, i) => ({
						href: `/category/${category.slug}`,
						title: category.name,
						image: category.image ?? CARD_IMAGES[i] ?? null,
						footer: plainText(category.description) || "Category",
					}))
				: [],
	};
}

export async function FeatureCards() {
	const { heading, entries } = await getEntries();
	if (entries.length === 0) return null;
	return (
		<section aria-label={heading} className="grid grid-cols-1 gap-3 md:grid-cols-3">
			{entries.map((entry) => (
				<Link
					key={entry.href}
					href={entry.href}
					className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
				>
					<div className="relative h-60 w-full shrink-0 overflow-hidden bg-banner">
						{entry.image && (
							<YNSMedia
								src={entry.image}
								alt=""
								fill
								sizes="(min-width: 768px) 30vw, 100vw"
								className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							/>
						)}
					</div>
					<div className="flex-1 p-4">
						<p className="text-base">{entry.title}</p>
					</div>
					<p className="px-6 pb-6 text-sm text-muted-foreground">{entry.footer}</p>
				</Link>
			))}
		</section>
	);
}
