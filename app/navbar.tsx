import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	return (
		<nav className="hidden lg:flex items-center gap-8">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors py-2"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors py-2"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
