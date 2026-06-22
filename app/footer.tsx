import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { Newsletter } from "@/components/sections/newsletter";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
			>
				Blog
			</YnsLink>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--lime)]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--lime)]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-[var(--forest-deep)] text-white">
			{/* Newsletter band */}
			<Newsletter />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-14 sm:py-16">
					{/* Brand */}
					<div className="col-span-2 md:col-span-4">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-center gap-2">
							<span className="flex size-8 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--forest-deep)]">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									className="size-4"
									aria-hidden
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="4" fill="currentColor" />
									<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
								</svg>
							</span>
							<span className="text-[15px] font-semibold tracking-[0.18em] uppercase text-white">
								Your Next Store
							</span>
						</YnsLink>
						<p className="mt-5 text-sm text-white/70 leading-relaxed max-w-xs">
							Premium solar panels, inverters and storage — designed in California, delivered to your roof.
						</p>

						<ul className="mt-6 space-y-3 text-sm text-white/70">
							<li className="flex items-center gap-3">
								<MapPinIcon className="size-4 text-[var(--lime)] shrink-0" />
								1247 Sunbeam Ave, Sacramento, CA
							</li>
							<li className="flex items-center gap-3">
								<PhoneIcon className="size-4 text-[var(--lime)] shrink-0" />
								<a href="tel:+18005551234" className="hover:text-[var(--lime)] transition-colors">
									1-800-555-SOLAR
								</a>
							</li>
							<li className="flex items-center gap-3">
								<MailIcon className="size-4 text-[var(--lime)] shrink-0" />
								<a
									href="mailto:hello@yournextstore.com"
									className="hover:text-[var(--lime)] transition-colors"
								>
									hello@yournextstore.com
								</a>
							</li>
						</ul>
					</div>

					<div className="md:col-span-2 md:col-start-6">
						<FooterCollections />
					</div>

					<div className="md:col-span-3">
						<h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--lime)]">
							Support
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
								>
									Installation guides
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
								>
									Warranty claims
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
								>
									Financing
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="md:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-white/55">
						&copy; {year} Your Next Store. All rights reserved. Solar tax credits subject to eligibility.
					</p>
					<div className="flex items-center gap-2">
						{[
							{
								label: "Instagram",
								path: (
									<>
										<rect x="3" y="3" width="18" height="18" rx="5" />
										<circle cx="12" cy="12" r="4" />
										<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
									</>
								),
							},
							{
								label: "Facebook",
								path: <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9.5a.5.5 0 0 1 .5-.5z" />,
							},
							{
								label: "LinkedIn",
								path: (
									<>
										<rect x="3" y="3" width="18" height="18" rx="3" />
										<path d="M8 10v8M8 7v.01M12 18v-5a3 3 0 0 1 6 0v5M12 13v5" />
									</>
								),
							},
						].map(({ label, path }) => (
							<a
								key={label}
								href="#"
								className="flex size-9 items-center justify-center rounded-full bg-white/5 hover:bg-[var(--lime)] hover:text-[var(--forest-deep)] text-white/80 transition-colors"
							>
								<span className="sr-only">{label}</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									className="size-4"
									aria-hidden
									stroke="currentColor"
									strokeWidth="1.7"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									{path}
								</svg>
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
