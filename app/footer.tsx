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
			<Link href="/blog" className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors">
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
			<Link href="/contact" className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors">
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
			<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Catalog</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
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
			<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
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
		<footer className="bg-[#0f1012] text-[#f2f3f5]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				{/* Giant wordmark band */}
				<div className="border-b border-[#22262a] py-14 sm:py-20">
					<h2 className="display-headline text-[clamp(2.5rem,11vw,9rem)] text-[#f2f3f5] leading-[0.85]">
						Your Next
						<br />
						Store.
					</h2>
				</div>

				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 py-14 sm:py-16">
					<div className="lg:col-span-2 max-w-xs">
						<p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Your Next Store</p>
						<p className="mt-5 text-sm leading-relaxed text-[#c8ccd0]">
							Premium hardware for the next generation of commerce. Designed, engineered, and assembled with
							obsession.
						</p>
						<div className="mt-6 flex items-center gap-2 text-xs text-[#8a8f94]">
							<span className="inline-block size-1.5 rounded-full bg-[#22c55e] signal-dot" />
							<span className="font-mono uppercase tracking-[0.2em]">All systems nominal</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link href="/about" className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="#reserve"
									className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
								>
									Test Ride
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
								>
									Shop
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#22262a] py-6 text-xs text-[#8a8f94]">
					<p className="font-mono uppercase tracking-[0.2em]">© {year} Your Next Store · Edition 01</p>
					<PaymentMethods />
					<p className="font-mono uppercase tracking-[0.2em]">Designed on Earth · Built to last</p>
				</div>
			</div>
		</footer>
	);
}
