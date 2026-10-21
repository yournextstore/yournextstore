import { Mail } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getSocialLinks, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// Everything the footer shows comes from cached reads, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [brand, categories, socials, legal] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(6),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);

	const shop: FooterLink[] = [
		{ href: "/products", label: "All products" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
	];
	const help: FooterLink[] = [
		{ href: "/about", label: "Our story" },
		{ href: "/faq", label: "FAQ" },
		...(brand.contact ? [{ href: "/contact", label: "Say hello" }] : []),
		...(brand.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const legalLinks: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));

	return { brand, shop, help, legalLinks, socials, year: new Date().getFullYear() };
}

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
	if (links.length === 0) return null;
	return (
		<div>
			<h2 className="mb-4 font-heading text-lg text-ink">{title}</h2>
			<ul className="space-y-2.5 text-sm">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="text-muted-foreground transition-colors hover:text-pine">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const { brand, shop, help, legalLinks, socials, year } = await getFooterData();

	return (
		<footer className="bg-footerbg">
			{/* Newsletter band */}
			<div className="border-b border-line/70">
				<div className="container-x flex flex-col items-center gap-6 py-10 lg:flex-row lg:justify-between">
					<BrandMark name={brand.name} tagline={brand.tagline} />
					<div className="flex items-center gap-3 text-ink">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
							<Mail className="size-5" strokeWidth={1.75} aria-hidden="true" />
						</span>
						<p className="max-w-xs font-heading text-lg leading-snug">
							Join our list for new arrivals, sizing notes and news from the studio.
						</p>
					</div>
					<FooterNewsletter />
				</div>
			</div>

			{/* Main footer */}
			<div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<p className="font-heading text-3xl leading-tight text-ink text-balance">
						Soft organic clothes for little ones
					</p>
					{socials.length > 0 && (
						<ul className="mt-5 flex flex-wrap gap-2">
							{socials.map((social) => (
								<li key={social.key}>
									<a
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex h-9 items-center rounded-full bg-surface px-4 text-sm text-ink shadow-card transition-colors hover:bg-primary hover:text-primary-foreground"
									>
										{social.label}
									</a>
								</li>
							))}
						</ul>
					)}
				</div>
				<LinkColumn title="Shop" links={shop} />
				<LinkColumn title="Got a question?" links={help} />
				<LinkColumn title="The small print" links={legalLinks} />
			</div>

			<div className="border-t border-line/70">
				<div className="container-x flex flex-col items-center gap-4 py-5 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
					<p>
						&copy; {year} {brand.name}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
