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
		<nav className="hidden sm:flex items-center gap-6">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
