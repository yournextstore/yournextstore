import { cacheLife } from "next/cache";
import Link from "next/link";
import { subscribeToNewsletter } from "@/app/newsletter/action";
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
			<Link href="/blog" className="text-sm text-white/80 hover:text-white transition-colors">
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
			<Link href="/contact" className="text-sm text-white/80 hover:text-white transition-colors">
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
			<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Menu</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/80 hover:text-white transition-colors"
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
			<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/80 hover:text-white transition-colors"
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
		<footer className="bg-navy text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand */}
					<div>
						<Link
							href="/"
							className="font-[family-name:var(--font-playfair)] text-xl tracking-wide text-white"
						>
							Your Next Store
						</Link>
						<div className="mt-6 flex items-center gap-4">
							<span className="text-sm text-white/60">Follow us</span>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Support</h3>
						<ul className="space-y-3">
							<li>
								<Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-white/80 hover:text-white transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />

					{/* Newsletter */}
					<div>
						<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Sign up and save</h3>
						<p className="text-sm text-white/70 mb-4">
							Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
						</p>
						<form
							className="space-y-3"
							action={async (formData) => {
								"use server";
								await subscribeToNewsletter(null, formData);
							}}
						>
							<div className="flex">
								<input
									type="email"
									name="email"
									required
									placeholder="Enter your email"
									className="flex-1 bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
								/>
								<button
									type="submit"
									className="px-4 py-2.5 bg-white/20 text-white text-sm hover:bg-white/30 transition-colors border border-white/20 border-l-0"
								>
									Subscribe
								</button>
							</div>
							{/* Marketing permissions: the subscribe action refuses a signup without this box. */}
							<label className="flex cursor-pointer items-start gap-2 py-1 text-xs leading-snug text-white/70">
								<input
									type="checkbox"
									name="marketingConsent"
									required
									className="mt-0.5 size-4 shrink-0 accent-cream"
								/>
								<span>
									I agree to receive marketing emails and accept the privacy policy. You can unsubscribe at
									any time.
								</span>
							</label>
						</form>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-white/40">&copy; {year} Your Next Store. All rights reserved.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
