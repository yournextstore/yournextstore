import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden sm:flex items-center gap-8">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-sm font-bold uppercase tracking-wide text-foreground hover:text-[#ff2524] transition-colors"
			>
				Shop
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-bold uppercase tracking-wide text-foreground hover:text-[#ff2524] transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
