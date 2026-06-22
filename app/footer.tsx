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
			<h3 className="uppercase-display text-[11px] tracking-[0.24em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link
						href="/products"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						All products
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="uppercase-display text-[11px] tracking-[0.24em] text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="border-t border-border bg-background">
			<div className="px-4 sm:px-8 lg:px-12">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 max-w-sm">
						<Link
							href="/"
							className="uppercase-display text-base tracking-[0.2em] font-medium text-foreground"
						>
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed">
							Botanical-grade skincare and apothecary essentials. Formulated with precision, calibrated for
							every skin condition.
						</p>
						<div className="mt-7 flex items-center gap-4 text-muted-foreground">
							{["Instagram", "Substack", "Are.na", "Vimeo"].map((s) => (
								<Link
									key={s}
									href="/"
									className="uppercase-display text-[10.5px] tracking-[0.2em] hover:text-foreground transition-colors"
								>
									{s}
								</Link>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="uppercase-display text-[11px] tracking-[0.24em] text-foreground">Support</h3>
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
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Shipping
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Returns
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />

					<div>
						<h3 className="uppercase-display text-[11px] tracking-[0.24em] text-foreground">Studio</h3>
						<address className="mt-5 not-italic text-sm text-muted-foreground leading-relaxed">
							YNS Laboratoires
							<br />
							14 rue de l&apos;Apothicaire
							<br />
							75011 Paris · FR
						</address>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {year} Your Next Store — All rights reserved
					</p>
					<div className="flex flex-col gap-3 sm:items-end">
						<p className="text-[11px] uppercase-display tracking-[0.22em] text-muted-foreground">
							Formulated · Calibrated · Verified
						</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
