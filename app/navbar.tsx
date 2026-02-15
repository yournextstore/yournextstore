import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="flex items-center gap-1">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="px-4 py-3 text-sm font-medium text-white/90 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wide"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="hidden lg:block px-4 py-3 text-sm font-medium text-white/90 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wide"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
