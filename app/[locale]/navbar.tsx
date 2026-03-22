import { cacheLife } from "next/cache";
import Link from "next/link";
import { getCommerce } from "@/lib/commerce";
import { getCachedTranslations, localePath } from "@/lib/translations";

export async function Navbar({ locale, currency }: { locale: string; currency: string }) {
	"use cache";
	cacheLife("hours");

	const api = getCommerce({ lang: locale, currency });

	const [collections, t] = await Promise.all([
		api.collectionBrowse({ limit: 5 }),
		getCachedTranslations(locale, "Navbar"),
	]);

	return (
		<nav className="hidden sm:flex items-center gap-6">
			<Link
				prefetch={true}
				href={localePath(locale, "/")}
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			>
				{t("home")}
			</Link>
			<Link
				prefetch={true}
				href={localePath(locale, "/products")}
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			>
				{t("products")}
			</Link>
			{collections.data.map((collection) => (
				<Link
					prefetch={true}
					key={collection.id}
					href={localePath(locale, `/collection/${collection.slug}`)}
					className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					{collection.name}
				</Link>
			))}
		</nav>
	);
}
