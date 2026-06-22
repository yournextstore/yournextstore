import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { PlantchiFlower } from "@/components/plantchi-logo";
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
				className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
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
				className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
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
			<h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbe9d7]/70">Shop</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
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
			<h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbe9d7]/70">Fine print</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
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
		<footer className="bg-[#1b2a2e] text-[#fbe9d7]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2">
						<Link href="/" className="inline-flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5a623] text-[#1b2a2e]">
								<PlantchiFlower size={28} />
							</div>
							<span className="font-display text-2xl font-black tracking-tight">Your Next Store</span>
						</Link>
						<p className="mt-4 max-w-xs text-sm text-[#fbe9d7]/70 leading-relaxed">
							Seasonings with benefits. Plant-based, third-party tested, milled in small batches.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "TikTok", "Pinterest", "Email"].map((s) => (
								<Link
									href="#"
									key={s}
									aria-label={s}
									className="flex h-9 w-9 items-center justify-center rounded-full border border-[#fbe9d7]/20 text-[#fbe9d7]/80 hover:bg-[#f5a623] hover:text-[#1b2a2e] hover:border-[#f5a623] transition-colors text-[10px] font-bold uppercase tracking-wider"
								>
									{s.charAt(0)}
								</Link>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbe9d7]/70">Help</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									href="/about"
									className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
								>
									Stockists
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="font-display text-base text-[#fbe9d7] hover:text-[#f5a623] transition-colors"
								>
									Say Hello
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-16 overflow-hidden">
					<p
						className="font-display font-black tracking-[-0.04em] text-[#fbe9d7]/15 leading-none text-[18vw] sm:text-[16vw] lg:text-[14vw] select-none"
						aria-hidden="true"
					>
						Your Next Store
					</p>
				</div>

				<div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#fbe9d7]/15 pt-6">
					<p className="text-xs text-[#fbe9d7]/55">&copy; {year} Your Next Store. Sprinkled with care.</p>
					<PaymentMethods />
					<p className="text-xs text-[#fbe9d7]/55">Plant-based · Organic · Non-GMO</p>
				</div>
			</div>
		</footer>
	);
}
