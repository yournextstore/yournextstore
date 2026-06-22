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
			<h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground mb-6">Collections</h3>
			<ul className="space-y-3">
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
			<h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground mb-6">Information</h3>
			<ul className="space-y-3">
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
		<footer className="bg-secondary">
			{/* Newsletter bar */}
			<div className="border-b border-border">
				<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h3 className="font-heading text-2xl text-foreground">Sign up and save</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
							</p>
						</div>
						<form className="flex w-full md:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="h-12 px-4 bg-background border border-border text-sm w-full md:w-72 focus:outline-none focus:border-foreground transition-colors"
							/>
							<button
								type="submit"
								className="h-12 px-6 bg-foreground text-primary-foreground text-sm uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors whitespace-nowrap"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* Footer columns */}
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10">
				<div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{/* Brand */}
					<div>
						<Link href="/" className="font-heading text-xl text-foreground">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Curated essentials for the modern workspace. Quality products, thoughtfully designed.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Support</h3>
						<ul className="mt-4 space-y-3">
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
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />

					{/* Info */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground mb-6">
							Support
						</h3>
						<ul className="space-y-3">
							<li>
								<span className="text-sm text-muted-foreground">contact@yournextstore.com</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">Mon - Fri, 9am - 5pm EST</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground">&copy; {year} Your Next Store. All rights reserved.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
