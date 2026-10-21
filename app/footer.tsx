import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { getCollectionTiles, getSocialLinks, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const headingClass = "mb-4 font-body text-2xs uppercase tracking-widest text-gold";
const linkClass = "font-body text-sm text-cream/75 transition-colors hover:text-cream";

// `new Date()` is an unstable value: reading it during the prerender is an error. Caching pins it.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [brand, collections, socials, legal] = await Promise.all([
		getStoreBrand(),
		getCollectionTiles(4),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	return { brand, collections, socials, legal: legal.data, year: new Date().getFullYear() };
}

/** The original's royal-violet footer: serif name, Shop / Help / Newsletter columns, quiet bottom row. */
export async function Footer() {
	const { brand, collections, socials, legal, year } = await getFooterData();

	return (
		<footer className="mt-auto bg-royal pt-16 pb-8 text-cream/80">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="grid grid-cols-2 gap-12 border-b border-cream/10 pb-12 lg:grid-cols-4">
					<div className="col-span-2 lg:col-span-1">
						<Link
							href="/"
							className="mb-4 block font-display text-3xl uppercase tracking-[0.2em] text-cream lg:text-4xl"
						>
							{brand.name}
						</Link>
						<p className="font-body text-sm leading-relaxed text-cream/75">{brand.description}</p>
						{socials.length > 0 && (
							<ul className="mt-6 flex flex-wrap gap-3">
								{socials.map((social) => (
									<li key={social.key}>
										<a
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="font-body text-2xs uppercase tracking-widest text-cream/75 transition-colors hover:text-gold"
										>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>

					<div>
						<h2 className={headingClass}>Shop</h2>
						<ul className="space-y-2">
							<li>
								<Link href="/products" className={linkClass}>
									All Products
								</Link>
							</li>
							{collections.map((collection) => (
								<li key={collection.id}>
									<Link href={collection.href} className={linkClass}>
										{collection.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h2 className={headingClass}>Help</h2>
						<ul className="space-y-2">
							<li>
								{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
								<a href="/account" className={linkClass}>
									My Orders
								</a>
							</li>
							<li>
								<Link href="/about" className={linkClass}>
									Our Story
								</Link>
							</li>
							{brand.contact && (
								<li>
									<Link href="/contact" className={linkClass}>
										Contact Us
									</Link>
								</li>
							)}
							<li>
								<Link href="/faq" className={linkClass}>
									FAQ
								</Link>
							</li>
							{brand.blog && (
								<li>
									<Link href="/blog" className={linkClass}>
										Journal
									</Link>
								</li>
							)}
						</ul>
					</div>

					<div className="col-span-2 lg:col-span-1">
						<h2 className={headingClass}>Newsletter</h2>
						<p className="mb-4 font-body text-sm text-cream/75">
							Be first to know about new arrivals and exclusive offers.
						</p>
						<FooterNewsletter />
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-4 pt-8 lg:flex-row">
					<p className="font-body text-xs text-cream/75">
						&copy; {year} {brand.name}. All rights reserved.
					</p>
					{legal.length > 0 && (
						<ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
							{legal.map((page) => (
								<li key={page.id}>
									<Link
										href={`/legal${page.href}`}
										className="font-body text-xs text-cream/75 transition-colors hover:text-cream"
									>
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					)}
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
