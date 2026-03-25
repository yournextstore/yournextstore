import { cacheLife } from "next/cache";
import { MobileNav } from "@/app/mobile-nav";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });
	const links = [
		{ href: "/products", label: "Shop" },
		...collections.data.slice(0, 4).map((collection) => ({
			href: `/collection/${collection.slug}`,
			label: collection.name,
		})),
	];

	return (
		<>
			<MobileNav links={links} />
			<nav className="hidden items-center gap-7 lg:flex">
				{links.map((link) => (
					<YnsLink
						prefetch={"eager"}
						key={link.href}
						href={link.href}
						className="text-[0.78rem] uppercase tracking-[0.18em] text-foreground/62 transition-colors hover:text-foreground"
						activeClassName="text-foreground"
						exactHrefMatch={link.href === "/products"}
					>
						{link.label}
					</YnsLink>
				))}
				<YnsLink
					prefetch={"eager"}
					href="/faq"
					className="text-[0.78rem] uppercase tracking-[0.18em] text-foreground/45 transition-colors hover:text-foreground"
					activeClassName="text-foreground"
				>
					Services
				</YnsLink>
			</nav>
		</>
	);
}
