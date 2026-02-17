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
		<nav className="hidden items-center gap-6 sm:flex">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
			>
				Shop
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
