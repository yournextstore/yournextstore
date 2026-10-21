import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import {
	getCategoryTiles,
	getCollectionTiles,
	getContactEmail,
	getSocials,
	getStoreIdentity,
} from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getFooterColumns() {
	"use cache";
	cacheLife("hours");

	const [categories, collections, legal, me] = await Promise.all([
		getCategoryTiles(),
		getCollectionTiles(),
		commerce.legalPageBrowse().catch(() => null),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const shop: FooterLink[] = [
		{ href: "/products", label: "All products" },
		...categories.slice(0, 5).map((tile) => ({ href: tile.href, label: tile.label })),
		...collections.slice(0, 2).map((tile) => ({ href: tile.href, label: tile.label })),
	];
	const service: FooterLink[] = [
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(legal?.data ?? []).map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	const about: FooterLink[] = [
		{ href: "/about", label: "Our Story" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		{ href: "/search", label: "Search" },
	];
	return { shop, service, about };
}

// `new Date()` is an unstable value: reading it during the prerender is an error. Caching pins it.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div>
			<h2 className="mb-3 font-semibold">{title}</h2>
			<ul className="flex flex-col gap-y-2">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="text-sm hover:underline">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const [year, columns, identity, socials, email] = await Promise.all([
		getCopyrightYear(),
		getFooterColumns(),
		getStoreIdentity(),
		getSocials(),
		getContactEmail(),
	]);

	return (
		<footer className="mt-20 border-t border-zinc-600 md:mt-44">
			<div className="shell pt-6 pb-10 md:pt-8">
				<div className="mb-14 grid gap-y-12 md:mb-20 lg:grid-cols-5 lg:gap-x-24">
					<div className="lg:col-span-2">
						<FooterNewsletter />
					</div>
					<div className="grid max-w-[680px] grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:pt-8">
						<FooterColumn title="Shop" links={columns.shop} />
						<FooterColumn title="Customer Service" links={columns.service} />
						<FooterColumn title={`About ${identity.name}`} links={columns.about} />
					</div>
				</div>

				<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div className="flex flex-col items-start gap-x-5 gap-y-2 md:flex-row md:items-center">
						<Link href="/" className="text-3xl font-medium uppercase">
							{identity.name}
						</Link>
						<div className="text-[11px] font-light leading-relaxed">
							<p>
								&copy; {year} {identity.name}
								{identity.description ? ` · ${identity.description}` : ""}
							</p>
							{email && (
								<p>
									<a className="hover:underline" href={`mailto:${email}`}>
										{email}
									</a>
								</p>
							)}
						</div>
					</div>
					<div className="flex flex-col items-start gap-4 md:items-end">
						{socials.length > 0 && (
							<ul className="flex flex-wrap gap-x-5 text-sm text-muted-foreground">
								{socials.map((social) => (
									<li key={social.href}>
										<a href={social.href} target="_blank" rel="noreferrer" className="hover:text-foreground">
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
