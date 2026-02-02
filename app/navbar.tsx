import { cacheLife } from "next/cache";
import Link from "next/link";
import { YnsLink } from "@/components/yns-link";
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
			<YnsLink href="/" className="hover:text-primary transition-colors uppercase">
				Home
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="hover:text-primary transition-colors uppercase"
				>
					{collection.name}
				</YnsLink>
			))}
		</>
	);
}
