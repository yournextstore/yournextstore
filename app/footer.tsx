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
				className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
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
				className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
			>
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="heritage-smallcaps text-[var(--cream)]/80">Shop</h3>
			<ul className="mt-5 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link
						href="/products"
						className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
					>
						The whole catalogue
					</Link>
				</li>
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
			<h3 className="heritage-smallcaps text-[var(--cream)]/80">The Fine Print</h3>
			<ul className="mt-5 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
						>
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
		<footer className="heritage-oxblood-gradient text-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-16 sm:pt-20 pb-12 grid grid-cols-2 lg:grid-cols-12 gap-10">
					<div className="col-span-2 lg:col-span-4">
						<Link href="/" className="block">
							<span className="font-display text-3xl sm:text-4xl tracking-[-0.01em] text-[var(--cream)]">
								Your Next Store
							</span>
						</Link>
						<p className="mt-4 max-w-sm text-[15px] italic leading-relaxed text-[var(--cream)]/75">
							A heritage mattress workshop on Elizabeth Street. Hand-tufted goods, ticking-striped cotton, and
							a hundred-year ledger of slow, repairable sleep.
						</p>
						<address className="mt-6 not-italic font-sans text-[13px] leading-relaxed text-[var(--cream)]/65">
							The Workshop, 114 Elizabeth Street
							<br />
							New York · Open by appointment
							<br />
							<a
								href="mailto:bench@yournextstore.com"
								className="underline-offset-4 hover:text-[var(--sand)]"
							>
								bench@yournextstore.com
							</a>
						</address>
					</div>

					<div className="col-span-1 lg:col-span-2">
						<FooterCollections />
					</div>

					<div className="col-span-1 lg:col-span-2">
						<h3 className="heritage-smallcaps text-[var(--cream)]/80">Workroom</h3>
						<ul className="mt-5 space-y-2.5">
							<li>
								<Link
									href="/#story"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									Our story
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link
									href="/#journal"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									Journal
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-2 lg:col-span-2">
						<FooterLegalPages />
					</div>

					<div className="col-span-2 lg:col-span-2">
						<h3 className="heritage-smallcaps text-[var(--cream)]/80">Correspondence</h3>
						<ul className="mt-5 space-y-2.5 font-display italic text-[15px] text-[var(--cream)]/85">
							{[
								{ label: "Instagram", href: "https://instagram.com" },
								{ label: "Pinterest", href: "https://pinterest.com" },
								{ label: "Substack", href: "https://substack.com" },
							].map((s) => (
								<li key={s.label}>
									<a href={s.href} className="hover:text-[var(--sand)] transition-colors">
										{s.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="border-t border-[var(--cream)]/15 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="font-sans text-[12px] tracking-[0.18em] uppercase text-[var(--cream)]/55">
						© {year} Your Next Store · Est. an heirloom
					</p>
					<div className="flex flex-col sm:flex-row items-center gap-3">
						<p className="font-display italic text-[13px] text-[var(--cream)]/65">
							Made slowly, in a brownstone, in New York.
						</p>
						<PaymentMethods className="rounded-sm bg-[var(--cream)] px-2 py-1" />
					</div>
				</div>
			</div>
		</footer>
	);
}
