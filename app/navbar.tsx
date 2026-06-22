import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	return (
		<nav className="hidden lg:flex items-center">
			<div className="flex items-center bg-card rounded-full px-1 py-1 shadow-soft">
				<Link
					href="/"
					className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
				>
					Home
				</Link>
				{collections.data.map((collection) => (
					<Link
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
					>
						{collection.name}
					</Link>
				))}
			</div>
		</nav>
	);
}
