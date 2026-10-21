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
		{ href: "/products", label: "Shop everything" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
		{ href: "/about", label: "Our story" },
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

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
	if (links.length === 0) return null;
	return (
		<div>
			<h2 className="caps mb-3.5 text-[0.66rem] font-bold tracking-[0.12em] text-white/90">{title}</h2>
			<ul className="space-y-2">
				{links.map((link) => (
					<li key={link.href}>
						{link.external ? (
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[0.8rem] text-white/75 transition-colors hover:text-white"
							>
								{link.label}
							</a>
						) : (
							<Link
								href={link.href}
								className="text-[0.8rem] text-white/75 transition-colors hover:text-white"
							>
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

/** The original's ink footer: white wordmark and line, then short uppercase-titled columns. */
export async function Footer() {
	const { brand, explore, hello, legalLinks, year } = await getFooterData();

	return (
		<footer className="bg-ink text-[#eef2eb]">
			<div className="mx-auto grid max-w-[1180px] gap-9 px-5 pb-12 pt-[60px] sm:grid-cols-2 md:flex md:justify-center md:gap-x-16 lg:gap-x-[95px]">
				<div className="md:mr-8">
					<BrandMark name={brand.name} className="text-white" />
					<p className="mt-4 max-w-56 text-[0.78rem] text-white/75">{brand.tagline}</p>
				</div>
				<LinkColumn title="Explore" links={explore} />
				<LinkColumn title="Say hello" links={hello} />
				<LinkColumn title="The small print" links={legalLinks} />
			</div>
			<div className="border-t border-white/10">
				<div className="mx-auto flex max-w-[1180px] flex-col items-center gap-4 px-5 py-6 text-center text-[0.7rem] text-white/70 sm:flex-row sm:justify-between sm:text-left">
					<p>
						&copy; {year} {brand.name}. Chosen with care.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
