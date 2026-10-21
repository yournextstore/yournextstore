import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, categories, legal] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const store: FooterLink[] = [
		{ href: "/products", label: "All products" },
		{ href: "/search", label: "Search" },
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	return {
		identity,
		store,
		categories: categories.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
		year: new Date().getFullYear(),
	};
}

/** The original's StoreDoubleColumn: a ruled heading over two short link columns. */
function LinkColumns({ title, links }: { title: string; links: FooterLink[] }) {
	if (links.length === 0) return null;
	const half = Math.ceil(links.length / 2);
	const columns = links.length > 3 ? [links.slice(0, half), links.slice(half)] : [links];
	return (
		<div>
			<h2 className="border-b border-slate-line pb-3 text-base font-semibold">{title}</h2>
			<div className="flex gap-x-16 pt-2 sm:gap-x-24">
				{columns.map((column) => (
					<ul key={column[0]?.href} className="flex flex-col">
						{column.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="inline-block py-2 text-sm text-slate-body transition-colors hover:text-slate-ink"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				))}
			</div>
		</div>
	);
}

/** complexFooter: store blurb on the left, the two link columns on the right, centred copyright. */
export async function Footer() {
	const { identity, store, categories, year } = await getFooterData();

	return (
		<footer className="mt-20 bg-white sm:mt-24">
			<div className="container-ae">
				<div className="grid gap-10 border-t border-slate-line pt-12 md:grid-cols-12 md:gap-6">
					<div className="md:col-span-4">
						<Link href="/" className="text-xl font-semibold text-slate-ink">
							{identity.storeName}
						</Link>
						<p className="mt-3 max-w-xs text-sm text-slate-body">
							{identity.storeDescription ?? "Knitwear, shirts, trousers and coats in natural fibres."}
						</p>
					</div>
					<div className="grid gap-8 md:col-span-8 lg:grid-cols-2 lg:gap-6">
						<LinkColumns title="Store" links={store} />
						<LinkColumns title="Categories" links={categories} />
					</div>
				</div>
				<div className="mt-12 flex flex-col items-center gap-4 pb-10 lg:flex-row lg:justify-between">
					<p className="text-center text-sm text-slate-body">
						Copyright © {year} {identity.storeName}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
