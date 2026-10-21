import { cacheLife } from "next/cache";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getSocialLinks, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

// Everything the footer shows comes from cached reads, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [brand, categories, socials, legal] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(4),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);

	const main: FooterLink[] = [
		{ href: "/products", label: "The range" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
		{ href: "/about", label: "The shop" },
		...(brand.contact ? [{ href: "/contact", label: "Write to us" }] : []),
		{ href: "/faq", label: "Questions" },
		...(brand.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const small: FooterLink[] = [
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		...socials.map((social) => ({ href: social.href, label: `${social.label} ↗`, external: true })),
	];

	return { brand, main, small, year: new Date().getFullYear() };
}

/** The original's footer: wordmark and a row of soft links, then one mono line of small print. */
export async function Footer() {
	const { brand, main, small, year } = await getFooterData();

	return (
		<footer className="relative border-t border-line pb-[2.4rem] pt-12">
			<div className="wrap flex flex-wrap items-center justify-between gap-4 pb-6">
				<BrandMark name={brand.name} className="text-[1.4rem]" />
				<nav aria-label="Footer" className="-mx-2.5 flex flex-wrap gap-1">
					{main.map((link) => (
						<Link key={link.href} href={link.href} className="nav-link px-2.5 py-1.5 text-[0.84rem]">
							{link.label}
						</Link>
					))}
				</nav>
			</div>
			<div className="wrap mono flex flex-col gap-4 border-t border-line-2 pt-5 text-[0.72rem] text-faint md:flex-row md:items-center md:justify-between">
				<div className="flex flex-col gap-2">
					<p>
						© {year} {brand.name} — every good thing starts on paper.
					</p>
					{small.length > 0 && (
						<ul className="flex flex-wrap gap-x-4 gap-y-1">
							{small.map((link) => (
								<li key={link.href}>
									{link.external ? (
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-ochre hover:underline"
										>
											{link.label}
										</a>
									) : (
										<Link href={link.href} className="text-ochre hover:underline">
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
				<PaymentMethods />
			</div>
		</footer>
	);
}
