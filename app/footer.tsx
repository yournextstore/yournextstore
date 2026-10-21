import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Newsletter } from "@/components/sections/newsletter";
import { getCategories, getCollections, getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [storeName, me, categories, collections, legal, socials] = await Promise.all([
		getStoreName(),
		meGetCached().catch(() => null),
		getCategories(),
		getCollections(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const blurb =
		me?.store.settings?.storeDescription ||
		"A small furniture workshop. Solid oak, ash and walnut, cut, joined and finished by hand.";

	const catalogue: FooterLink[] = [
		{ href: "/products", label: "All pieces" },
		...collections.slice(0, 4).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		{ href: "/about", label: "About" },
	];
	const rooms: FooterLink[] = categories
		.filter((c) => c.count > 0)
		.slice(0, 6)
		.map((c) => ({ href: `/category/${c.slug}`, label: c.name }));
	const information: FooterLink[] = [
		{ href: "/faq", label: "Questions" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	const networks = {
		instagram: "Instagram",
		facebook: "Facebook",
		x: "X",
		youtube: "YouTube",
		linkedin: "LinkedIn",
		tiktok: "TikTok",
	} as const;
	const elsewhere: FooterLink[] = [
		...Object.entries(networks).flatMap(([key, label]) => {
			const url = socials?.socials[key as keyof typeof networks];
			return url ? [{ href: url, label }] : [];
		}),
		...(socials?.socials.email
			? [{ href: `mailto:${socials.socials.email}`, label: socials.socials.email }]
			: []),
	];

	const columns = [
		{ heading: "Catalogue", links: catalogue },
		{ heading: "Categories", links: rooms },
		{ heading: "Information", links: information },
		{ heading: "Elsewhere", links: elsewhere },
	].filter((column) => column.links.length > 0);

	return { storeName, blurb, columns, year: new Date().getFullYear() };
}

export async function Footer() {
	const { storeName, blurb, columns, year } = await getFooterData();

	return (
		<footer className="mt-24 border-t border-border md:mt-36">
			<Newsletter />

			<div className="shell pt-16">
				<div className="grid gap-12 md:grid-cols-12 md:gap-8">
					<div className="md:col-span-4">
						<p className="wordmark">{storeName}</p>
						<p className="type-body mt-4 max-w-[34ch] text-[0.9375rem]">{blurb}</p>
					</div>
					<div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 md:col-span-8">
						{columns.map((column) => (
							<nav key={column.heading} aria-label={column.heading}>
								<h2 className="label">{column.heading}</h2>
								<ul className="mt-5 space-y-2.5">
									{column.links.map((link) => (
										<li key={link.href}>
											{/^(https?:|mailto:)/.test(link.href) ? (
												<a
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
													className="link text-[0.9375rem] text-muted-foreground"
												>
													{link.label}
												</a>
											) : (
												<Link href={link.href} className="link text-[0.9375rem] text-muted-foreground">
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>
				</div>

				<div className="mt-20 flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
					<p className="mono text-[0.6875rem] uppercase tracking-[0.05em] text-muted-foreground">
						© {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
