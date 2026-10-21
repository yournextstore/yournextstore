import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Wordmark } from "@/components/wordmark";
import { getStoreInfo, hasMembers } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [info, collections, categories, legal] = await Promise.all([
		getStoreInfo(),
		commerce.collectionBrowse({ limit: 4 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ limit: 4 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const shop: FooterLink[] = [
		{ href: "/products", label: "All products" },
		...categories.data
			.filter((c) => !c.parentId)
			.map((c) => ({ href: `/category/${c.slug}`, label: c.name.split(">").at(-1)?.trim() || c.name })),
		...collections.data.filter(hasMembers).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
	].slice(0, 5);
	const website: FooterLink[] = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(info.contact ? [{ href: "/contact", label: "Contact" }] : []),
		...(info.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
	const legalLinks: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));
	return { info, shop, website, legalLinks, year: new Date().getFullYear() };
}

function Column({ title, links }: { title: string; links: FooterLink[] }) {
	if (links.length === 0) return null;
	return (
		<div>
			<h2 className="mb-3 font-medium text-slate-700 md:mb-5">{title}</h2>
			<ul className="space-y-2.5">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="transition hover:underline">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const { info, shop, website, legalLinks, year } = await getFooterData();

	return (
		<footer className="bg-white px-6">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col items-start justify-between gap-10 border-b border-slate-500/30 py-10 text-slate-600 md:flex-row">
					<div>
						<Wordmark name={info.storeName} />
						<p className="mt-6 max-w-[410px] text-sm">
							{info.storeDescription ??
								`Welcome to ${info.storeName}, a curated shop for everyday finds. From bags and shoes to prints and accessories, we bring good things together in one place.`}
						</p>
						{info.socialLinks.length > 0 && (
							<ul className="mt-5 flex flex-wrap items-center gap-3">
								{info.socialLinks.map((social) => (
									<li key={social.href}>
										<a
											href={social.href}
											target="_blank"
											rel="noreferrer"
											className="flex h-10 items-center justify-center rounded-full bg-slate-100 px-4 text-sm capitalize transition hover:scale-105"
										>
											{social.network === "x" ? "X" : social.network}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="grid w-full grid-cols-2 gap-8 text-sm sm:flex sm:justify-between md:w-[45%]">
						<Column title="SHOP" links={shop} />
						<Column title="WEBSITE" links={website} />
						<Column title="LEGAL" links={legalLinks} />
					</div>
				</div>
				<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-slate-600">
						Copyright {year} © {info.storeName}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
