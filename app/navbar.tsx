import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<nav className="hidden sm:flex items-center gap-6">
			<Link
				href="/"
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			>
				Home
			</Link>
			{collections.data.map((collection) => (
				<Link
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					{collection.name}
				</Link>
			))}
		</nav>
	);
}
