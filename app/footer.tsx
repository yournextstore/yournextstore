import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getNavData } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const linkClass = "underline-offset-4 hover:text-ink hover:underline";

async function getLegalPages() {
	"use cache";
	cacheLife("hours");
	const pages = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	return pages.data.map((page) => ({ href: `/legal${page.href}`, label: page.label }));
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const [nav, legal, year] = await Promise.all([getNavData(), getLegalPages(), getCopyrightYear()]);
	const columns = [
		{ title: "Shop", links: [{ href: "/products", label: "All pieces" }, ...nav.shelf.slice(0, 5)] },
		{ title: "House", links: nav.pages },
		...(legal.length > 0 ? [{ title: "Legal", links: legal }] : []),
	];

	return (
		<footer className="mt-12 w-full border-t border-line bg-tile/40">
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-8 px-5 py-8 sm:grid-cols-[1.2fr_1fr] sm:gap-10 sm:px-10 sm:py-12">
					<div>
						<p className="flex items-center gap-2 font-display text-xl font-bold">
							<span
								aria-hidden
								className="inline-flex size-7 items-center justify-center bg-ink font-display text-[16px] font-medium italic text-paper"
							>
								{nav.storeName.charAt(0).toUpperCase()}
							</span>
							{nav.storeName}
						</p>
						<p className="mt-3 max-w-[36ch] text-[14px] leading-relaxed text-muted-foreground">
							{nav.storeDescription ??
								"Pieces chosen slowly and made to be worn for years. Browse the collection, keep what you love."}
						</p>
					</div>
					<nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-[14px] sm:grid-cols-3">
						{columns.map((column) => (
							<div key={column.title}>
								<p className="font-semibold">{column.title}</p>
								<ul className="mt-3 space-y-2 text-muted-foreground">
									{column.links.map((link) => (
										<li key={link.href}>
											<Link href={link.href} className={linkClass}>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>
				<div className="flex flex-col-reverse items-center gap-y-4 border-t border-line px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8 sm:px-10 sm:py-5">
					<p className="text-small text-muted-foreground">
						&copy; {year} {nav.storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
