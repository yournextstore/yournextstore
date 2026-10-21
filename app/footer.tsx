import { cacheLife } from "next/cache";
import Link from "next/link";
import { Wordmark } from "@/components/brand-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getLedgerStats, getSocialLinks, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

// Everything the footer shows comes from cached reads, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [brand, categories, socials, legal, stats] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(4),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		getLedgerStats(),
	]);

	const links: FooterLink[] = [
		{ href: "/products", label: "Shop" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
		{ href: "/#shelves", label: "The shelves" },
		{ href: "/about", label: "The house" },
		...(brand.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const help: FooterLink[] = [
		...(brand.contact ? [{ href: "/contact", label: "Write to us" }] : []),
		{ href: "/faq", label: "Questions" },
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		...socials.map((social) => ({ href: social.href, label: `${social.label} ↗`, external: true })),
	];

	return { brand, links, help, stats, year: new Date().getFullYear() };
}

function FooterLinks({ label, links }: { label: string; links: FooterLink[] }) {
	return (
		<nav aria-label={label} className="flex flex-col gap-2.5 text-[0.9rem] text-dim">
			{links.map((link) =>
				link.external ? (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						className="w-fit transition-colors hover:text-gold-2"
					>
						{link.label}
					</a>
				) : (
					<Link key={link.href} href={link.href} className="w-fit transition-colors hover:text-gold-2">
						{link.label}
					</Link>
				),
			)}
		</nav>
	);
}

/** The original's footer: wordmark and line, a DM Mono column of particulars, then the links. */
export async function Footer() {
	const { brand, links, help, stats, year } = await getFooterData();

	return (
		<footer className="border-t border-line bg-[linear-gradient(180deg,var(--page),#20060f)] px-[clamp(18px,4vw,48px)] pb-[34px] pt-[clamp(44px,7vh,72px)]">
			<div className="mx-auto mb-[2.6rem] grid max-w-[1200px] gap-7 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
				<div>
					<p className="serif text-[1.7rem] font-semibold leading-tight text-cream">
						<Wordmark name={brand.name} />
					</p>
					<p className="serif mt-1.5 text-[1.05rem] text-dim italic">{brand.tagline}</p>
				</div>
				<div className="ledger space-y-4 text-[0.7rem] leading-[1.9] tracking-[0.12em] text-dim">
					<p>
						{stats.pieces} {stats.pieces === 1 ? "entry" : "entries"} in the ledger
						<br />
						{stats.shelves} {stats.shelves === 1 ? "shelf" : "shelves"} kept
					</p>
					<p>
						Open every day · online
						<br />
						Delivery settled at checkout
					</p>
				</div>
				<FooterLinks label="Footer" links={links} />
				<FooterLinks label="Help and legal" links={help} />
			</div>
			<div className="mono mx-auto flex max-w-[1200px] flex-col gap-4 border-t border-line-2 pt-[22px] text-[0.68rem] tracking-[0.04em] text-faint sm:flex-row sm:items-center sm:justify-between">
				<p>
					&copy; {year} {brand.name} — kept in one ledger.
				</p>
				<PaymentMethods />
			</div>
		</footer>
	);
}
