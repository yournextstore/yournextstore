import { cacheLife } from "next/cache";
import Link from "next/link";
import { getCollections } from "@/lib/commerce";

async function NavLinks() {
	"use cache";
	cacheLife("hours");

	const collections = await getCollections();

	return (
		<nav className="hidden sm:flex items-center gap-6">
			<Link
				href="/"
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			>
				Home
			</Link>
			{collections.map((collection) => (
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

export function Navbar() {
	return <NavLinks />;
}
