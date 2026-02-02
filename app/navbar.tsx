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
		<nav className="hidden lg:flex items-center">
			<div className="flex items-center bg-card rounded-full px-1 py-1 shadow-soft">
				<YnsLink
					prefetch={"eager"}
					href="/"
					className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
				>
					Home
				</YnsLink>
				{collections.data.map((collection) => (
					<YnsLink
						prefetch={"eager"}
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
					>
						{collection.name}
					</YnsLink>
				))}
			</div>
		</nav>
	);
}
