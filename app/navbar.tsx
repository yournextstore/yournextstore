import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="hover:text-primary transition-colors"
				activeClassName="text-primary"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="hover:text-primary transition-colors"
					activeClassName="text-primary"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
