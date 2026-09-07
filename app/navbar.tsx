import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="flex items-center gap-1">
			<Link
				href="/"
				className="px-4 py-3 text-sm font-medium text-white/90 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wide"
			>
				Home
			</Link>
			<Link
				href="/products"
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			>
				Products
			</Link>
			{collections.data.map((collection) => (
				<Link
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="hidden lg:block px-4 py-3 text-sm font-medium text-white/90 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wide"
				>
					{collection.name}
				</Link>
			))}
		</nav>
	);
}
