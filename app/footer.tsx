import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getHeaderData } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; plain?: boolean };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [header, me, legal] = await Promise.all([
		getHeaderData(),
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const shop: FooterLink[] = [
		{ href: "/products", label: "New in" },
		...header.categories.slice(0, 4).map((category) => ({ href: category.href, label: category.name })),
		{ href: "/#looks", label: "Shop the look" },
	];
	const service: FooterLink[] = [
		{ href: "/faq", label: "Help & FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/search", label: "Search" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const house: FooterLink[] = [
		{ href: "/about", label: `About ${header.storeName}` },
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	// Plain <a> into /account: it is a proxied zone (see AGENTS.md).
	const account: FooterLink[] = [
		{ href: "/account", label: "Sign in", plain: true },
		{ href: "/account", label: "Orders & returns", plain: true },
		...(tools?.newsletter ? [{ href: "/#newsletter", label: "Newsletter" }] : []),
	];
	return {
		storeName: header.storeName,
		columns: [
			["Shop", shop],
			["Service", service],
			["House", house],
			["Account", account],
		] as const,
		// `new Date()` is an unstable value; caching pins it to the entry.
		year: new Date().getFullYear(),
	};
}

export async function Footer() {
	const { storeName, columns, year } = await getFooterData();
	// The outlined wordmark fills the width whatever the store's name: scale it by its length.
	const letters = Math.max(storeName.length, 6);
	const wordmarkSize = `clamp(40px, ${Math.min(12.4, 124 / letters).toFixed(2)}vw, ${Math.round(Math.min(210, 2100 / letters))}px)`;

	return (
		<footer className="mt-14 border-t border-line sm:mt-24 lg:mt-32">
			<div className="mx-auto grid max-w-[1640px] grid-cols-2 gap-x-7 gap-y-10 px-4 pt-10 sm:gap-10 sm:px-5 sm:pt-20 lg:grid-cols-4 lg:gap-12 lg:px-9">
				{columns.map(([title, links]) => (
					<div key={title}>
						<h2 className="cap-xs mb-4 font-light text-faint">{title}</h2>
						<ul className="flex flex-col gap-1">
							{links.map((link) => (
								<li key={`${link.label}-${link.href}`}>
									{link.plain ? (
										<a
											href={link.href}
											className="inline-block py-1.5 text-[11px] tracking-[0.08em] text-soft hover:text-foreground"
										>
											{link.label}
										</a>
									) : (
										<Link
											href={link.href}
											className="inline-block py-1.5 text-[11px] tracking-[0.08em] text-soft hover:text-foreground"
										>
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className="mx-auto max-w-[1640px] px-5 pt-16 lg:px-9">
				<div
					aria-hidden
					className="overflow-hidden whitespace-nowrap text-center uppercase leading-[0.9] tracking-[0.06em] text-transparent"
					style={{ fontSize: wordmarkSize, WebkitTextStroke: "1px #d8d5cd" }}
				>
					{storeName}
				</div>
			</div>
			<div className="mx-auto flex max-w-[1640px] flex-col gap-5 px-4 pb-10 pt-6 text-[10px] tracking-[0.1em] text-faint sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5 lg:px-9">
				<p>
					© {year} {storeName}
				</p>
				<PaymentMethods />
			</div>
		</footer>
	);
}
