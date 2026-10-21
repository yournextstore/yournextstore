import { cacheLife } from "next/cache";
import Link from "next/link";
import { LogoLockup } from "@/components/brand/logo";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterColumn = { title: string; links: { href: string; label: string }[] };

// The original's three columns (Shop, The house, Help) filled from the store: categories under
// Shop, the store's own pages under The house, FAQ and the legal pages under Help.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, categories, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const columns: FooterColumn[] = [
		{
			title: "Shop",
			links: [
				{ href: "/products", label: "Everything" },
				...categories.data
					.filter((category) => !category.parentId)
					.slice(0, 5)
					.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
			],
		},
		{
			title: "The house",
			links: [
				{ href: "/about", label: "Our story" },
				...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
				...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			],
		},
		{
			title: "Help",
			links: [
				{ href: "/faq", label: "FAQ" },
				...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
			],
		},
	];
	return {
		storeName: me?.store.name || "Your Next Store",
		description: me?.store.settings?.storeDescription || "",
		currency: me?.store.currency ?? null,
		year: new Date().getFullYear(),
		columns,
	};
}

export async function Footer() {
	const { storeName, description, currency, year, columns } = await getFooterData();

	return (
		<footer>
			<div className="container-page grid gap-14 py-16 lg:grid-cols-[1.2fr_2fr]">
				<div className="space-y-5">
					<Link href="/" className="inline-block">
						<LogoLockup name={storeName} />
					</Link>
					{description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
				</div>
				<div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
					{columns.map((column) => (
						<nav key={column.title} aria-label={column.title}>
							<h2 className="font-display text-lg text-ink">{column.title}</h2>
							<ul className="mt-4 space-y-3 text-sm">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="text-muted-foreground transition-colors hover:text-ink">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
			</div>
			<div className="container-page">
				<div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {year} {storeName}
						{currency ? `. Prices in ${currency}.` : "."}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
