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
				className="text-sm text-bone/80 hover:text-bone transition-colors"
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
				className="text-sm text-bone/80 hover:text-bone transition-colors"
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
		return (
			<div>
				<h3 className="text-[10px] tracking-[0.32em] uppercase text-bone/55">Shop</h3>
				<ul className="mt-5 space-y-3">
					{["Women", "Men", "Accessories", "Gift cards"].map((label) => (
						<li key={label}>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm text-bone/80 hover:text-bone transition-colors"
							>
								{label}
							</YnsLink>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-[10px] tracking-[0.32em] uppercase text-bone/55">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-bone/80 hover:text-bone transition-colors"
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
			<h3 className="text-[10px] tracking-[0.32em] uppercase text-bone/55">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-bone/80 hover:text-bone transition-colors"
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
		<footer className="bg-charcoal text-bone">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				{/* Top wordmark */}
				<div className="pt-20 pb-12 border-b border-bone/10 text-center">
					<p className="text-[11px] tracking-[0.36em] uppercase text-clay">Your Next Store</p>
					<p className="mt-6 font-display text-5xl sm:text-7xl lg:text-[120px] leading-[0.9] tracking-tight">
						Crafted, <span className="italic text-clay/90">not</span> manufactured.
					</p>
				</div>

				{/* Columns */}
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 py-16">
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-2xl tracking-[0.24em] uppercase text-bone"
						>
							YNS
						</YnsLink>
						<p className="mt-5 text-sm text-bone/65 leading-relaxed">
							Editorial fashion essentials, sun-bleached and slow-made. Designed in our studio, shipped from
							Lisbon — globally.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "Pinterest", "Substack"].map((label) => (
								<a
									key={label}
									href="#"
									className="inline-flex items-center justify-center h-9 px-4 rounded-full border border-bone/20 text-[10px] tracking-[0.28em] uppercase text-bone/75 hover:bg-bone/10 hover:text-bone transition-colors"
								>
									{label}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] tracking-[0.32em] uppercase text-bone/55">Studio</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-bone/80 hover:text-bone transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-bone/80 hover:text-bone transition-colors"
								>
									Help & FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-bone/80 hover:text-bone transition-colors"
								>
									Lookbook
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-bone/80 hover:text-bone transition-colors"
								>
									Contact
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-7 border-t border-bone/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] tracking-wider text-bone/55">
					<p>&copy; {new Date().getFullYear()} Your Next Store · Lisbon · All rights reserved.</p>
					<p className="flex items-center gap-2 uppercase tracking-[0.22em] text-[10px]">
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" /> Studio open Mon–Fri ·
						10:00–18:00 WET
					</p>
				</div>
			</div>
		</footer>
	);
}
