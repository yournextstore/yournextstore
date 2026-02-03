import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden md:flex space-x-12 text-sm font-medium items-center tracking-wide text-muted-foreground">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-foreground border-b-2 border-primary pb-1"
				activeClassName="text-foreground border-b-2 border-primary pb-1"
			>
				Home
			</YnsLink>
			<YnsLink
				prefetch={"eager"}
				href="/#philosophy"
				className="hover:text-primary transition-colors"
				activeClassName="text-foreground border-b-2 border-primary pb-1"
			>
				About Us
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="hover:text-primary transition-colors"
					activeClassName="text-foreground border-b-2 border-primary pb-1"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
