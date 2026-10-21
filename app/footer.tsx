import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/deckle";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

async function getLegalPages() {
	"use cache";
	cacheLife("hours");
	const pages = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	return pages.data;
}

type FooterColumn = { title: string; links: { label: string; href: string }[] };

/** The ink-dark foot of every page: what the shop is, where to go, the small print. */
export async function Footer() {
	const [year, brand, categories, legal] = await Promise.all([
		getCopyrightYear(),
		getStoreBrand(),
		getCategoryTiles(3),
		getLegalPages(),
	]);

	const columns: FooterColumn[] = [
		{
			title: "Shop",
			links: [
				{ label: "All products", href: "/products" },
				{ label: "Collections", href: "/collections" },
				...categories.map((category) => ({ label: category.name, href: category.href })),
			],
		},
		{
			title: "About",
			links: [
				{ label: "About us", href: "/about" },
				{ label: "FAQ", href: "/faq" },
				...(brand.contact ? [{ label: "Contact", href: "/contact" }] : []),
				...(brand.blog ? [{ label: "Journal", href: "/blog" }] : []),
			],
		},
	];

	return (
		<footer className="band-x bg-deep py-16 text-sm text-on-deep">
			<div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
				<div className="col-span-full grid max-w-[30ch] content-start gap-3 text-on-deep-2 lg:col-span-1">
					<Logo name={brand.name} onDeep />
					{brand.description && <p>{brand.description}</p>}
				</div>
				{/* One landmark for the footer's links: a second "Shop" navigation would sound the same as the header's. */}
				<nav aria-label="Footer" className="col-span-full grid grid-cols-2 gap-8 lg:col-span-1">
					{columns.map((column) => (
						<div key={column.title} className="grid content-start gap-3">
							<h2 className="font-semibold">{column.title}</h2>
							<ul className="grid gap-2 text-on-deep-2">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="transition-colors hover:text-on-deep">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
				<div className="col-span-full grid content-start gap-4 text-on-deep-2 lg:col-span-1">
					{legal.length > 0 && (
						<ul aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
							{legal.map((page) => (
								<li key={page.id}>
									<Link href={`/legal${page.href}`} className="transition-colors hover:text-on-deep">
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					)}
					<p>
						&copy; {year} {brand.name}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
