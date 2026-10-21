import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Wordmark } from "@/components/wordmark";
import { getNavCatalog, getStoreDescription, getStoreName } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const linkClass = "text-sm text-footer-muted transition-colors hover:text-accent";
const headingClass = "font-display text-sm font-bold uppercase tracking-wider text-footer-foreground";

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [legal, socials] = await Promise.all([
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const socialLinks = Object.entries(socials?.socials ?? {}).flatMap(([platform, value]) => {
		if (!value) {
			return [];
		}
		const href = platform === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value;
		return [{ platform, href }];
	});
	return { legal: legal.data, socialLinks };
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
	if (links.length === 0) {
		return null;
	}
	return (
		<div className="space-y-4">
			<h2 className={headingClass}>{title}</h2>
			<ul className="space-y-2.5">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className={linkClass}>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const [year, storeName, description, catalog, { legal, socialLinks }] = await Promise.all([
		getCopyrightYear(),
		getStoreName(),
		getStoreDescription(),
		getNavCatalog(),
		getFooterData(),
	]);

	const shop = [
		...catalog.categories.slice(0, 4).map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
		...catalog.collections.slice(0, 3).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		{ href: "/products", label: "All Products" },
	];
	const company = [
		{ href: "/about", label: "About Us" },
		...(catalog.contact ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/faq", label: "FAQ" },
		...(catalog.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const support = legal.map((page) => ({ href: `/legal${page.href}`, label: page.label }));

	return (
		<footer className="bg-footer text-footer-foreground">
			<div className="wrapper py-16">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-4">
					<div className="space-y-4">
						<Link href="/" aria-label={`${storeName} home`} className="block">
							<Wordmark name={storeName} tone="footer" className="text-2xl" />
						</Link>
						<p className="max-w-[280px] text-sm leading-relaxed text-footer-muted">
							{description || "Loose-leaf tea and teaware, chosen for slow, unhurried days."}
						</p>
						{socialLinks.length > 0 && (
							<ul className="flex flex-wrap items-center gap-2 pt-1">
								{socialLinks.map(({ platform, href }) => (
									<li key={platform}>
										<a
											href={href}
											target="_blank"
											rel="noreferrer"
											className="flex h-9 items-center rounded-full border border-footer-foreground/25 px-3 text-xs capitalize text-footer-muted transition-colors hover:border-accent hover:text-accent"
										>
											{platform}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<FooterColumn title="Shop" links={shop} />
					<FooterColumn title="Company" links={company} />
					<FooterColumn title="Support" links={support} />
				</div>

				<div className="mt-12 flex flex-col items-center gap-4 border-t border-footer-foreground/15 pt-8 text-center">
					<PaymentMethods className="justify-center" />
					<p className="text-xs text-footer-muted">
						&copy; {year} {storeName}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
