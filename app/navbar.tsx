import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden md:flex items-center gap-6">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-xs font-normal tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-xs font-normal tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
		</nav>
	);
}
