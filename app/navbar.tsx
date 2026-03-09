import { Search } from "lucide-react";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden sm:flex items-center gap-1">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="/search"
				className="ml-2 p-1.5 text-foreground/70 hover:text-foreground transition-colors"
				aria-label="Search"
			>
				<Search className="h-4 w-4" />
			</YnsLink>
		</nav>
	);
}
