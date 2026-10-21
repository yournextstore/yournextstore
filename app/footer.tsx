import { cacheLife } from "next/cache";
import Link from "next/link";
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
		categories: categories.slice(0, 5),
		socialLinks,
		legal: legal.data,
		year: new Date().getFullYear(),
	};
}

const headingClass = "mb-5 text-sm font-bold text-neutral-600 md:text-base";
const listClass = "flex flex-col gap-2 text-xs text-neutral-600 md:text-sm";
const linkClass = "transition hover:text-neutral-900";

export async function Footer() {
	const { identity, categories, socialLinks, legal, year } = await getFooterData();

	return (
		<footer className="bg-card">
			<div className="kara-container py-10">
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="flex flex-col md:flex-1">
						<Link
							href="/"
							className="text-[1.625rem] font-bold uppercase leading-none tracking-[-0.04em] text-neutral-900"
						>
							{identity.storeName}
						</Link>
						<p className="max-w-sm py-4 text-sm text-muted-foreground">
							{identity.storeDescription ??
								"A small, independent shop offering a thoughtfully curated collection of high-quality everyday pieces."}
						</p>
						{socialLinks.length > 0 && (
							<ul className="my-3 flex flex-wrap gap-2">
								{socialLinks.map((social) => (
									<li key={social.href}>
										<a
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block rounded-lg bg-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-300"
										>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex-[2] md:justify-items-center">
						{categories.length > 0 && (
							<div>
								<h2 className={headingClass}>Shop</h2>
								<ul className={listClass}>
									{categories.map((category) => (
										<li key={category.slug}>
											<Link href={`/category/${category.slug}`} className={linkClass}>
												{sentenceCase(category.name)}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
						<div>
							<h2 className={headingClass}>Company</h2>
							<ul className={listClass}>
								<li>
									<Link href="/about" className={linkClass}>
										About
									</Link>
								</li>
								<li>
									<Link href="/faq" className={linkClass}>
										Help &amp; FAQ
									</Link>
								</li>
								{identity.contactFormEnabled && (
									<li>
										<Link href="/contact" className={linkClass}>
											Contact us
										</Link>
									</li>
								)}
								{identity.blogEnabled && (
									<li>
										<Link href="/blog" className={linkClass}>
											Blog
										</Link>
									</li>
								)}
							</ul>
						</div>
						{legal.length > 0 && (
							<div>
								<h2 className={headingClass}>Legal</h2>
								<ul className={listClass}>
									{legal.map((page) => (
										<li key={page.id}>
											<Link href={`/legal${page.href}`} className={linkClass}>
												{page.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="bg-neutral-100">
				<div className="kara-container flex flex-col items-center justify-between gap-3 py-3 text-xs font-medium text-neutral-700 md:flex-row">
					<p>
						Copyright &copy; {year} {identity.storeName}
					</p>
					<PaymentMethods />
					<p>All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
