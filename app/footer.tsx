import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
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
			<Link
				href="/blog"
				className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
			>
				Blog
			</Link>
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
			<Link
				href="/contact"
				className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
			>
				Contact Us
			</Link>
		</li>
	);
}

const linkClass = "text-[12px] text-foreground/65 hover:text-foreground transition-colors";
const headingClass = "text-[10px] uppercase tracking-[0.32em] text-foreground/45";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className={headingClass}>The Range</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link href={`/collection/${collection.slug}`} className={linkClass}>
							{collection.name}
						</Link>
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
			<h3 className={headingClass}>Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link href={`/legal${page.href}`} className={linkClass}>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="bg-[var(--ink)] text-[var(--ivory)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10">
				{/* Wordmark sign-off */}
				<div className="text-center pb-14 border-b border-white/10">
					<Link
						href="/"
						className="font-serif italic font-light text-[14vw] sm:text-[10rem] leading-[0.85] tracking-tight text-[var(--ivory)] block"
					>
						Your Next Store
					</Link>
					<p className="mt-6 font-serif italic text-lg text-[var(--ivory)]/60">
						A laundry ritual, packed in paper.
					</p>
				</div>

				{/* Columns */}
				<div className="pt-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-[var(--ivory)]">
					<div>
						<h3 className={`${headingClass} text-[var(--ivory)]/45`}>Studio</h3>
						<p className="mt-5 text-[12px] leading-[1.7] text-[var(--ivory)]/65 max-w-[28ch]">
							Mess-free, enzyme-powered laundry detergent sheets in signature scents. Made slowly.
						</p>
					</div>
					{/* Collections (override text colors for dark footer via wrapper) */}
					<div className="[&_*]:!text-[var(--ivory)]/65 [&_h3]:!text-[var(--ivory)]/45 hover:[&_a]:!text-[var(--ivory)] [&_a]:transition-colors">
						<FooterCollections />
					</div>
					<div>
						<h3 className={`${headingClass} text-[var(--ivory)]/45`}>Care</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
								>
									Shop
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
					<div className="[&_*]:!text-[var(--ivory)]/65 [&_h3]:!text-[var(--ivory)]/45 hover:[&_a]:!text-[var(--ivory)] [&_a]:transition-colors">
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ivory)]/45">
						&copy; {year} Your Next Store — All rights reserved
					</p>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
						<p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ivory)]/45">
							Designed slowly, shipped in paper
						</p>
						<PaymentMethods className="rounded-sm bg-[var(--ivory)] px-2 py-1" />
					</div>
				</div>
			</div>
		</footer>
	);
}
