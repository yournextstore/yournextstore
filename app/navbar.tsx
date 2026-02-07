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
				className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
			>
				Home
			</YnsLink>
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			>
				Products
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
