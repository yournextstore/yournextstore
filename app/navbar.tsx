import { Search } from "lucide-react";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden sm:flex items-center gap-5">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-sm font-medium text-white/70 hover:text-brand transition-colors uppercase tracking-wide"
			>
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-medium text-white/70 hover:text-brand transition-colors uppercase tracking-wide"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="text-white/70 hover:text-brand transition-colors"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
		</nav>
	);
}
