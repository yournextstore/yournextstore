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
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
			<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Products</h3>
			<ul className="mt-4 space-y-2">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link
						href="/products"
						className="text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						All Products
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
			<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Shopping</h3>
			<ul className="mt-4 space-y-2">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
		<footer className="bg-secondary/50 border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-10 sm:py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
					{/* Legal / Shopping links */}
					<FooterLegalPages />

					{/* Product Collections */}
					<FooterCollections />

					{/* Account */}
					<div>
						<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Account</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<Link
									href="/cart"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Cart
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Browse Products
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Information */}
					<div>
						<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Information</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground">Your Next Store &copy; {year}. All rights reserved.</p>
					<PaymentMethods />
					<p className="text-xs text-muted-foreground">
						Email:{" "}
						<a href="mailto:shop@yournextstore.com" className="hover:text-primary transition-colors">
							shop@yournextstore.com
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
