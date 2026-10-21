import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { BrandName, Wordmark } from "@/components/wordmark";
import { getStoreInfo } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

async function getLegalPages() {
	"use cache";
	cacheLife("hours");
	const pages = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	return pages.data.map((page) => ({ href: `/legal${page.href}`, label: page.label }));
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

const linkClass = "text-[0.9375rem] text-[#d4d8de] transition-colors hover:text-white";

/** The original's two-tier footer: charcoal top (logo, socials, link columns, sign-up), midnight base bar. */
export async function Footer() {
	const [year, info, legal] = await Promise.all([getCopyrightYear(), getStoreInfo(), getLegalPages()]);

	return (
		<footer className="text-page">
			<div className="bg-coal">
				<div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1.5fr)] lg:gap-10 lg:px-20">
					<div className="space-y-6">
						<Link href="/" aria-label={`${info.storeName} home`} className="inline-block">
							<Wordmark name={info.storeName} tone="light" className="text-[2.5rem]" />
						</Link>
						{info.socialLinks.length > 0 && (
							<ul className="flex flex-wrap gap-4 text-sm font-medium">
								{info.socialLinks.map((social) => (
									<li key={social.href}>
										<a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
						{info.storeDescription && (
							<p className="max-w-xs text-[0.9375rem] leading-relaxed text-[#d4d8de]">
								{info.storeDescription}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-8 lg:border-r lg:border-white/25 lg:pr-10">
						<div>
							<h2 className="mb-5 text-base font-medium">Customer Care</h2>
							<ul className="space-y-2.5">
								<li>
									{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
									<a href="/account" className={linkClass}>
										My Account
									</a>
								</li>
								<li>
									<a href="/account" className={linkClass}>
										My Orders
									</a>
								</li>
								{info.contact && (
									<li>
										<Link href="/contact" className={linkClass}>
											Contact Us
										</Link>
									</li>
								)}
								<li>
									<Link href="/products" className={linkClass}>
										All Products
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-5 text-base font-medium">Information</h2>
							<ul className="space-y-2.5">
								<li>
									<Link href="/about" className={linkClass}>
										About {info.storeName}
									</Link>
								</li>
								{info.blog && (
									<li>
										<Link href="/blog" className={linkClass}>
											Blog
										</Link>
									</li>
								)}
								{legal.map((page) => (
									<li key={page.href}>
										<Link href={page.href} className={linkClass}>
											{page.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="lg:pl-6">
						{info.newsletter ? (
							<FooterNewsletter storeName={info.storeName} />
						) : (
							<>
								<h2 className="text-[1.75rem] leading-tight font-light uppercase sm:text-4xl">
									Find your next
									<br />
									favourite.
								</h2>
								<Link
									href="/products"
									className="mt-6 flex h-12 max-w-md items-center justify-between rounded-md bg-[#2a2a2a] pr-1.5 pl-4 text-sm text-[#d4d8de] transition-colors hover:bg-[#333]"
								>
									Browse the full range
									<span className="flex h-9 w-9 items-center justify-center rounded-full bg-page text-ink">
										<ArrowRight className="h-4 w-4" aria-hidden="true" />
									</span>
								</Link>
								<p className="mt-3 text-xs">
									New in at <BrandName name={info.storeName} className="[&>span]:text-[#ff6b70]" />
								</p>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="bg-midnight">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
					<div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-end sm:justify-between">
						<div className="space-y-3 text-[0.9375rem]">
							<p>
								&copy; {year} <span className="font-montserrat font-bold">{info.storeName}</span>
							</p>
							<p className="text-[#d4d8de]">
								Powered by:{" "}
								<a
									href="https://yournextstore.com"
									className="border-b border-page pb-1 text-page hover:text-sky"
									target="_blank"
									rel="noreferrer"
								>
									Your Next Store
								</a>
							</p>
						</div>
						<div className="flex flex-col gap-4 sm:items-end">
							<PaymentMethods />
							{legal.length > 0 && (
								<ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#d4d8de]">
									{legal.map((page) => (
										<li key={page.href}>
											<Link href={page.href} className="hover:text-white">
												{page.label}
											</Link>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
