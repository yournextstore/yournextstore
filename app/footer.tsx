import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getSocialLinks, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { getStoreConfig } from "@/lib/store-config";

type FooterLink = { href: string; label: string; external?: boolean };

// Everything the footer shows comes from cached reads, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [brand, categories, socials, legal, config] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(3),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		getStoreConfig(),
	]);

	const links: FooterLink[] = [
		{ href: "/products", label: "Shop" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
		{ href: "/about", label: "About" },
		...(brand.blog ? [{ href: "/blog", label: "Articles" }] : []),
		...(brand.contact ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/faq", label: "FAQ" },
	];
	const fine: FooterLink[] = [
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		...socials.map((social) => ({ href: social.href, label: `${social.label} ↗`, external: true })),
	];

	return { brand, links, fine, currency: config.currency, year: new Date().getFullYear() };
}

const linkClass =
	"nav-underline caps text-[0.875rem] text-ink transition-colors duration-150 [--u-bottom:-4px] hover:text-gold";

/**
 * The original's footer: brass wordmark and tagline at the left, centred caps links, a floating ↑ Top
 * at the right; under a faint rule, the copyright and the small print.
 */
export async function Footer() {
	const { brand, links, fine, currency, year } = await getFooterData();

	return (
		<footer className="border-t border-gold/10 bg-panel pt-12 pb-8">
			<div className="container-x">
				<div className="mb-6 grid items-center gap-6 border-b border-line-2 pb-8 text-center md:grid-cols-[1fr_auto_1fr] md:gap-8 md:text-left">
					<div>
						<Link
							href="/"
							className="serif mb-2 inline-block text-[1.5rem] font-bold uppercase tracking-[0.1em] text-gold"
						>
							{brand.name}
						</Link>
						<p className="mx-auto max-w-[250px] text-[0.875rem] text-dim md:mx-0">{brand.tagline}</p>
					</div>
					<nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-4">
						{links.map((link) => (
							<Link key={link.href} href={link.href} className={linkClass}>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="text-center md:text-right">
						<a
							href="#main"
							className="inline-flex flex-col items-center gap-1 p-3 text-dim transition-colors duration-150 hover:text-gold"
							aria-label="Back to top"
						>
							<span aria-hidden="true" className="float-up text-[1.25rem] leading-none">
								↑
							</span>
							<span className="caps text-[0.75rem] tracking-[0.15em]">Top</span>
						</a>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 text-center text-[0.875rem] text-dim md:flex-row md:text-left">
					<p>
						© {year} {brand.name}. All rights reserved.
					</p>
					<p>Prices in {currency}</p>
				</div>
				<div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-ink/5 pt-4 md:flex-row">
					{fine.length > 0 ? (
						<nav
							aria-label="Legal"
							className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.75rem] text-dim"
						>
							{fine.map((link) =>
								link.external ? (
									<a
										key={link.href}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="transition-colors hover:text-gold"
									>
										{link.label}
									</a>
								) : (
									<Link key={link.href} href={link.href} className="transition-colors hover:text-gold">
										{link.label}
									</Link>
								),
							)}
						</nav>
					) : (
						<span />
					)}
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
