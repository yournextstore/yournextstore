import { cacheLife } from "next/cache";
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
				className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
				className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
			<h3 className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
			<h3 className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
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
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-4xl tracking-[0.04em] text-white"
						>
							Your Next Store
						</YnsLink>
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
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
								>
									Shipping & Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[color:var(--color-luxe-cream)]/70 hover:text-white transition-colors"
								>
									Concierge
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col gap-3 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-[color:var(--color-luxe-cream)]/60">
						&copy; {new Date().getFullYear()} Your Next Store · Crafted in Grasse.
					</p>
					<p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-luxe-cream)]/40">
						Eau de Parfum · 100ml
					</p>
				</div>
			</div>
		</footer>
	);
}
