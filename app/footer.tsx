import { Mail, MapPin, Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
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
			<Link href="/blog" className="text-sm text-white/60 hover:text-gold transition-colors">
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
			<Link href="/contact" className="text-sm text-white/60 hover:text-gold transition-colors">
				Contact Us
			</Link>
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
			<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Collections</h3>
			<ul className="space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-gold transition-colors"
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
			<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Information</h3>
			<ul className="space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/60 hover:text-gold transition-colors"
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
		<footer className="bg-[#1a1a1a] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<Link
							href="/"
							className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white"
						>
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-white/60 leading-relaxed">
							Your trusted destination for premium automotive parts, accessories, and equipment. Quality
							products for every vehicle.
						</p>
						<div className="mt-6 space-y-3">
							<div className="flex items-center gap-2 text-sm text-white/60">
								<MapPin className="w-4 h-4 text-primary flex-shrink-0" />
								<span>123 Auto Parts Blvd, Suite 100</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-white/60">
								<Phone className="w-4 h-4 text-primary flex-shrink-0" />
								<span>(+800) 123 456 7890</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-white/60">
								<Mail className="w-4 h-4 text-primary flex-shrink-0" />
								<span>support@yournextstore.com</span>
							</div>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Customer Service */}
					<div>
						<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Service</h3>
						<ul className="space-y-2.5">
							<li>
								<Link href="/about" className="text-sm text-white/60 hover:text-gold transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-white/60 hover:text-gold transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/" className="text-sm text-white/60 hover:text-gold transition-colors">
									Shipping & Delivery
								</Link>
							</li>
							<li>
								<Link href="/" className="text-sm text-white/60 hover:text-gold transition-colors">
									Returns & Exchanges
								</Link>
							</li>
							<li>
								<Link href="/" className="text-sm text-white/60 hover:text-gold transition-colors">
									Order Tracking
								</Link>
							</li>
							<li>
								<Link href="/" className="text-sm text-white/60 hover:text-gold transition-colors">
									Contact Us
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10">
					<p className="text-sm text-white/40">&copy; {year} Your Next Store. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
