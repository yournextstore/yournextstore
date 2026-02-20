import { Home } from "lucide-react";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	return (
		<nav className="flex items-center gap-0 overflow-x-auto py-0">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="flex items-center gap-1 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-b-2 border-transparent hover:border-primary"
			>
				<Home className="h-4 w-4" />
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-b-2 border-transparent hover:border-primary whitespace-nowrap"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-b-2 border-transparent hover:border-primary whitespace-nowrap"
			>
				All Products
			</YnsLink>
		</nav>
	);
}
