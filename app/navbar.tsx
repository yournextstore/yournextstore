import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden md:flex items-center gap-8">
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-[13px] uppercase tracking-[0.15em] text-foreground/80 hover:text-foreground transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-[13px] uppercase tracking-[0.15em] text-foreground/80 hover:text-foreground transition-colors"
			>
				About
			</YnsLink>
		</nav>
	);
}
