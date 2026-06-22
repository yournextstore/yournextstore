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
				className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
				className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
			<h3 className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
			<h3 className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
		<footer className="relative overflow-hidden bg-luxe-frame text-luxe-cream">
			<div
				aria-hidden
				className="pointer-events-none absolute -top-40 right-10 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
				style={{
					background: "radial-gradient(closest-side, rgba(240,184,200,0.5), transparent 70%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
					{/* Brand */}
					<div className="col-span-2">
						<Link href="/" className="font-display text-4xl tracking-[0.04em] text-white">
							Your Next Store
						</Link>
						<p className="mt-5 max-w-xs text-sm leading-relaxed text-[color:var(--color-luxe-cream)]/70">
							Scented stories of luxury. Hand-poured, hand-finished, delivered with care.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-luxe-cream)]/50">
								Boutique
							</span>
							<span className="h-px flex-1 bg-white/15" />
						</div>
						<p className="mt-2 text-sm text-[color:var(--color-luxe-cream)]/70">
							14 Rue de la Paix, Paris · Open daily 10–19
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">
							Support
						</h3>
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
								<Link
									href="/faq"
									className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
								>
									Shipping & Returns
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
								>
									Concierge
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-3 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-[color:var(--color-luxe-cream)]/60">
						&copy; {year} Your Next Store · Crafted in Grasse.
					</p>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
						<PaymentMethods />
						<p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-luxe-cream)]/40">
							Eau de Parfum · 100ml
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
