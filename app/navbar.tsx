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
		<>
			<Link href="/" className="hover:text-primary transition-colors uppercase">
				Home
			</Link>
			{collections.data.map((collection) => (
				<Link
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="hover:text-primary transition-colors uppercase"
				>
					{collection.name}
				</Link>
			))}
		</>
	);
}
