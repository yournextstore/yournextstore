import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<nav className="hidden sm:flex items-center gap-2">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
