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
			<Link href="/blog" className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors">
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
			<Link href="/contact" className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors">
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
			<h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--yns-cream)]">shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors lowercase"
						>
							{collection.name.toLowerCase()}
						</Link>
					</li>
				))}
				<li>
					<Link
						href="/products"
						className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors"
					>
						all products
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
			<h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--yns-cream)]">fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors lowercase"
						>
							{page.label.toLowerCase()}
						</Link>
					</li>
				))}
				<li>
					<Link href="/faq" className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors">
						faq
					</Link>
				</li>
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
		<footer className="bg-[var(--yns-ink)] text-white">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 gap-10">
					<div className="col-span-2 sm:col-span-1 max-w-xs">
						<Link
							href="/"
							className="yns-keep-case font-[family-name:var(--font-display)] italic text-[var(--yns-red)] text-2xl"
						>
							your next store<span className="not-italic">.</span>
						</Link>
						<p className="mt-5 text-sm text-white/60 leading-relaxed lowercase">
							a wellness label for the chronically awake. essentials for the cult of rest, shipped from
							brooklyn at 3 a.m. (probably).
						</p>
						<div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
							<span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--yns-red)] yns-blink" />
							currently dreaming
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--yns-cream)]">read</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="#about"
									className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors"
								>
									meet p.
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors"
								>
									dead tired diaries
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors"
								>
									the science
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-white/70 hover:text-[var(--yns-red)] transition-colors"
								>
									wholesale
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="relative border-t border-white/10">
					<div className="py-10 flex flex-col items-center gap-6">
						<span className="font-[family-name:var(--font-display)] italic text-[18vw] sm:text-[12vw] lg:text-[10rem] leading-[0.85] text-white/[0.04] tracking-tight select-none">
							your next store
						</span>
					</div>
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
					<p>&copy; {year} your next store · all rights, mildly reserved</p>
					<PaymentMethods />
					<p className="flex items-center gap-4">
						<span>brooklyn · los angeles · tokyo</span>
						<span className="hidden sm:inline">·</span>
						<span>est. 2026</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
