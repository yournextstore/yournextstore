import { Music, Send, Sparkle } from "lucide-react";
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
			<Link href="/blog" className="text-[14px] text-white/80 hover:text-white transition-colors">
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
			<Link href="/contact" className="text-[14px] text-white/80 hover:text-white transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link href="/products" className="text-[14px] text-white/80 hover:text-white transition-colors">
						All bottles
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-[14px] text-white/80 hover:text-white transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link href="#bundles" className="text-[14px] text-white/80 hover:text-white transition-colors">
						Build a bundle
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

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">Company</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link href="/#about" className="text-[14px] text-white/80 hover:text-white transition-colors">
						Our story
					</Link>
				</li>
				<li>
					<Link href="/products" className="text-[14px] text-white/80 hover:text-white transition-colors">
						Sustainability
					</Link>
				</li>
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-[14px] text-white/80 hover:text-white transition-colors"
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
		<footer className="bg-[#0f0d18] text-white">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-16 sm:py-20">
					{/* Brand */}
					<div className="col-span-2">
						<Link href="/" className="font-display text-[36px] font-bold tracking-tight text-white">
							Your Next Store<span className="text-[#b4a4dd]">.</span>
						</Link>
						<p className="mt-4 text-[14px] text-white/65 leading-relaxed max-w-xs">
							Quietly considered hydration. Eleven shades, one shape, infinitely reusable.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[Sparkle, Send, Music].map((Icon, i) => (
								<span
									key={i}
									className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:bg-[#5e3ca8] hover:border-[#5e3ca8] transition-colors"
								>
									<Icon className="h-4 w-4" strokeWidth={1.8} />
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link href="/about" className="text-[14px] text-white/80 hover:text-white transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-[14px] text-white/80 hover:text-white transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-[14px] text-white/80 hover:text-white transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<Link href="/faq" className="text-[14px] text-white/80 hover:text-white transition-colors">
									Shipping & returns
								</Link>
							</li>
							<li>
								<Link href="/faq" className="text-[14px] text-white/80 hover:text-white transition-colors">
									Care guide
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 py-7 border-t border-white/10">
					<p className="text-[12px] text-white/45">&copy; {year} Your Next Store. Bottled with care.</p>
					<PaymentMethods className="text-white/40" />
				</div>
			</div>
		</footer>
	);
}
