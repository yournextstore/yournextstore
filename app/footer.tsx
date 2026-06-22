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
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] text-white/40">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 hover:text-white transition-colors"
						>
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] text-white/40">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/70 hover:text-white transition-colors"
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
		<footer className="relative bg-black border-t border-white/10 overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[700px] rounded-full bg-[var(--color-yns-yellow)]/10 blur-[100px]"
			/>
			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Big wordmark */}
				<div className="py-14 sm:py-20 text-center">
					<p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Refreshment, redefined</p>
					<h2 className="font-display mt-3 text-[14vw] sm:text-[10rem] leading-none text-white">
						YNS<span className="text-[var(--color-yns-yellow)]">.</span>
					</h2>
				</div>

				<div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10">
					<div className="col-span-2 max-w-xs">
						<Link href="/" className="font-display text-2xl text-white inline-flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-[var(--color-yns-yellow)]" />
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-white/55 leading-relaxed">
							Nitro-infused cool drinks, brewed in small batches for big moments.
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.22em] text-white/40">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-white/70 hover:text-white transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">
									All products
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-white/50">&copy; {year} Your Next Store. All rights reserved.</p>
					<PaymentMethods className="text-white/70" />
					<p className="text-xs text-white/40 uppercase tracking-[0.18em]">Sip cool · Stay sharp</p>
				</div>
			</div>
		</footer>
	);
}
