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

	const explore: FooterLink[] = [
		{ href: "/products", label: "The goods" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
		{ href: "/about", label: "The story" },
	];
	const hello: FooterLink[] = [
		...(brand.contact ? [{ href: "/contact", label: "Write to us" }] : []),
		{ href: "/faq", label: "Questions" },
		...(brand.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...socials.map((social) => ({ href: social.href, label: `${social.label} ↗`, external: true })),
	];
	const legalLinks: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));

	return { brand, explore, hello, legalLinks, year: new Date().getFullYear() };
}

function FooterLink({ link }: { link: FooterLink }) {
	const className = "transition-colors hover:text-ink";
	return link.external ? (
		<a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
			{link.label}
		</a>
	) : (
		<Link href={link.href} className={className}>
			{link.label}
		</Link>
	);
}

/** The original's foam footer: Bebas name beside a row of quiet links, mono small print underneath. */
export async function Footer() {
	const { brand, explore, hello, legalLinks, year } = await getFooterData();

	return (
		<footer className="relative z-[1] border-t border-line bg-foam pb-7 pt-[clamp(40px,6vh,60px)]">
			<div className="shell mb-7 flex flex-wrap items-center justify-between gap-5">
				<BrandMark name={brand.name} className="text-[2.2rem] tracking-[0.04em]" />
				<nav
					aria-label="Footer"
					className="flex flex-wrap gap-x-[clamp(12px,2vw,22px)] gap-y-2 text-[0.9rem] font-medium text-dim"
				>
					{[...explore, ...hello].map((link) => (
						<FooterLink key={link.href} link={link} />
					))}
				</nav>
			</div>
			<div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line-soft pt-6">
				<div className="mono flex flex-col gap-1 text-[0.66rem] leading-[1.9] tracking-[0.06em] text-faint">
					<p>
						&copy; {year} {brand.name} — {brand.tagline}
					</p>
					{legalLinks.length > 0 && (
						<ul className="flex flex-wrap gap-x-4">
							{legalLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-denim-deep underline underline-offset-3 hover:text-ink"
									>
										{link.label}
									</Link>
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
