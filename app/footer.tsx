import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { NewsletterForm } from "@/components/sections/newsletter";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";

// lucide no longer ships brand marks, so socials are text links.
const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, categories, socials, legal] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		commerce.socialsGet().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const socialLinks = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ href, label }] : [];
	});
	return {
		identity,
		socialLinks,
		shopLinks: [
			{ href: "/products", label: "Products" },
			...categories
				.slice(0, 3)
				.map((category) => ({ href: `/category/${category.slug}`, label: sentenceCase(category.name) })),
		],
		supportLinks: [
			{ href: "/about", label: "About us" },
			{ href: "/faq", label: "FAQs" },
			...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact us" }] : []),
			...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
			...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		],
		// `new Date()` is an unstable value in the prerendered shell; caching pins it to the entry.
		year: new Date().getFullYear(),
	};
}

const HEADING = "ed-display m-0 mb-3 text-[0.8125rem] font-bold uppercase tracking-[0.12em]";
const LINK = "text-sm text-muted-foreground transition-colors hover:text-foreground";

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
	return (
		<div>
			<h2 className={HEADING}>{title}</h2>
			<ul className="m-0 list-none space-y-2.5 p-0">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className={LINK}>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

/** The original's editorial footer: brand, newsletter, Shop and Support on the cream band. */
export async function Footer() {
	const { identity, socialLinks, shopLinks, supportLinks, year } = await getFooterData();

	return (
		<footer className="border-t border-border bg-canvas">
			<div className="page-width">
				<div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.15fr_1.5fr_0.6fr_0.75fr] lg:gap-12 lg:py-14">
					<div className="max-w-xs">
						<Link href="/" className="ed-display text-2xl font-medium text-foreground">
							{identity.storeName}
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
							{identity.storeDescription ?? "Fine everyday jewellery."}
						</p>
						{socialLinks.length > 0 && (
							<ul className="m-0 mt-5 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
								{socialLinks.map((social) => (
									<li key={social.href}>
										<a href={social.href} target="_blank" rel="noopener noreferrer" className={LINK}>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="md:max-w-md">
						<h2 className={`${HEADING} tracking-[0.14em]`}>Newsletter</h2>
						<p className="m-0 text-sm text-muted-foreground">
							Subscribe to get the latest arrivals and offers.
						</p>
						<NewsletterForm variant="footer" />
					</div>
					<div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-2">
						<LinkColumn title="Shop" links={shopLinks} />
						<LinkColumn title="Support" links={supportLinks} />
					</div>
				</div>
				<div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="m-0 text-[0.8125rem] text-muted-foreground">
						&copy; {year} <span className="font-medium text-foreground">{identity.storeName}</span>. All
						rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
