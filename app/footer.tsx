import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { Monogram } from "@/components/monogram";
import { PaymentMethods } from "@/components/payment-methods";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

export async function getSocialLinks() {
	"use cache";
	cacheLife("hours");
	const socials = await commerce.socialsGet().catch(() => null);
	return Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ href, label }] : [];
	});
}

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, categories, socialLinks, legal] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const columns = [
		{
			title: "Categories",
			links: categories
				.slice(0, 5)
				.map((category) => ({ href: `/category/${category.slug}`, label: sentenceCase(category.name) })),
		},
		{
			title: "Shop",
			links: [
				{ href: "/products", label: "All products" },
				{ href: "/products?sort=price-asc", label: "Best prices" },
				{ href: "/search", label: "Search" },
			],
		},
		{
			title: "Help",
			links: [
				{ href: "/about", label: "About us" },
				{ href: "/faq", label: "FAQ" },
				...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
				...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
			],
		},
		{
			title: "Legal",
			links: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		},
	].filter((column) => column.links.length > 0);
	return {
		storeName: identity.storeName,
		storeDescription: identity.storeDescription,
		socialLinks,
		columns,
		// `new Date()` is an unstable value in the prerendered shell; caching pins it to the entry.
		year: new Date().getFullYear(),
	};
}

export async function Footer() {
	const { storeName, storeDescription, socialLinks, columns, year } = await getFooterData();

	return (
		<footer className="bg-background">
			<div className="ds-container max-w-[64rem] pt-4 lg:pt-8">
				{/* Newsletter strip between two rules, as in the original. */}
				<div className="flex flex-col items-center justify-between gap-4 border-y border-border py-6 md:flex-row md:items-start">
					<div className="text-center md:text-left">
						<h2 className="font-bold uppercase tracking-widest text-gray-800">Newsletter</h2>
						<p className="text-muted-foreground">Subscribe to our newsletter</p>
					</div>
					<FooterNewsletter />
				</div>

				<div className="grid grid-cols-2 gap-y-12 pt-12 md:grid-cols-4 lg:grid-cols-6 lg:gap-8">
					<div className="col-span-full flex flex-col items-center text-center md:items-start md:text-left lg:col-span-2">
						<Link href="/" className="mb-4 inline-flex items-center gap-3">
							<Monogram storeName={storeName} />
							<span className="text-xl font-semibold text-ink md:text-2xl">{storeName}</span>
						</Link>
						<p className="mb-6 text-muted-foreground md:pr-8">
							{storeDescription ?? "Womenswear for every season, made to be worn often."}
						</p>
						{socialLinks.length > 0 && (
							<ul className="flex flex-wrap gap-4">
								{socialLinks.map((social) => (
									<li key={social.href}>
										<a
											href={social.href}
											className="text-sm text-muted-foreground transition-colors hover:text-ink"
											rel="noreferrer"
											target="_blank"
										>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					{columns.map((column) => (
						<div key={column.title} className="text-center md:text-left">
							<h2 className="mb-4 font-bold uppercase tracking-widest text-gray-800">{column.title}</h2>
							<ul className="flex flex-col items-center gap-4 md:items-start">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-muted-foreground transition-colors hover:text-sky-deep"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-16 flex flex-col items-center gap-4 border-t border-border py-8 text-center text-sm text-muted-foreground">
					<p>
						&copy; {year} - {storeName}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
