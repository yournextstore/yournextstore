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
			<Link href="/blog" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
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
			<Link href="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
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
			<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
			<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
		<footer className="border-t border-border/60 bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 sm:py-20 grid grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2">
						<Link href="/" className="font-serif text-3xl tracking-tight text-foreground">
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-foreground/65 leading-relaxed max-w-xs">
							Rooted in care, community, and intention. Salon-inspired rituals for texture-rich hair.
						</p>
						<div className="mt-6 flex items-center gap-3 text-foreground/60">
							{["Instagram", "TikTok", "Pinterest"].map((label) => (
								<span
									key={label}
									title={label}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-foreground/50 hover:text-foreground transition-colors"
								>
									<span className="text-[10px] font-medium tracking-[0.14em] uppercase">
										{label.charAt(0)}
									</span>
								</span>
							))}
						</div>
					</div>

					{/* Shop */}
					<div>
						<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">Shop</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									All Rituals
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Search
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support + Legal */}
					<div className="space-y-10">
						<div>
							<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">
								Support
							</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<Link
										href="/about"
										className="text-sm text-foreground/70 hover:text-foreground transition-colors"
									>
										About Us
									</Link>
								</li>
								<FooterContactLink />
								<li>
									<Link
										href="/faq"
										className="text-sm text-foreground/70 hover:text-foreground transition-colors"
									>
										FAQ
									</Link>
								</li>
							</ul>
						</div>
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-foreground/60">© {year} Your Next Store. Rooted in care.</p>
					<PaymentMethods />
					<p className="text-[10px] font-medium tracking-[0.28em] uppercase text-foreground/55">
						Celebrate Your Texture
					</p>
				</div>
			</div>
		</footer>
	);
}
