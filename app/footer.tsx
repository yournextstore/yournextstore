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
			<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Quick Links</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-brand-yellow transition-colors"
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
			<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/60 hover:text-brand-yellow transition-colors"
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
		<footer className="bg-brand-dark text-white">
			{/* Social bar */}
			<div className="border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-6">
					{["Instagram", "Facebook", "TikTok", "YouTube", "Pinterest"].map((social) => (
						<span
							key={social}
							className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-brand-yellow transition-colors cursor-pointer"
						>
							{social}
						</span>
					))}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Information</h3>
						<p className="text-sm text-white/60 leading-relaxed">
							Your Next Store — Scandinavian streetwear, conscious fashion since 1995. Quality products,
							thoughtfully designed.
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

					{/* Social */}
					<div>
						<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Follow Us</h3>
						<div className="flex flex-wrap gap-3">
							{["Discord", "Email", "Facebook", "Instagram"].map((social) => (
								<span
									key={social}
									className="text-sm text-white/60 hover:text-brand-yellow transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
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
