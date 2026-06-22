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
				className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
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
				className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
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
		return null;
	}

	return (
		<div>
			<h3 className="font-display uppercase tracking-[0.18em] text-[var(--yellow)] text-sm">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
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
			<h3 className="font-display uppercase tracking-[0.18em] text-[var(--yellow)] text-sm">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function FooterMarquee() {
	const phrases = ["YOUR NEXT STORE", "(♥,♥)", "BOLDLY DELICIOUS", "(♥,♥)", "LIVE DELICIOUSLY", "(♥,♥)"];
	const items = Array.from({ length: 4 }).flatMap(() => phrases);
	return (
		<div className="bg-[var(--pink)] text-white font-display uppercase tracking-[0.3em] py-3 overflow-hidden">
			<div className="yns-marquee">
				<div className="yns-marquee__track whitespace-nowrap text-sm">
					{items.map((p, i) => (
						<span key={`fm-${i}`} className="flex items-center gap-10">
							<span>{p}</span>
						</span>
					))}
				</div>
				<div className="yns-marquee__track whitespace-nowrap text-sm" aria-hidden="true">
					{items.map((p, i) => (
						<span key={`fm2-${i}`} className="flex items-center gap-10">
							<span>{p}</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-[var(--burgundy)] text-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					<div className="sm:max-w-xs lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display uppercase text-[var(--pink)] text-3xl leading-none"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-[var(--cream)]/75 leading-relaxed">
							A boldly delicious next-gen store. Curated, hand-packed, and a little bit naughty — in the best
							way.
						</p>
						<div className="mt-6 flex gap-3">
							{["IG", "TT", "PIN", "YT"].map((s) => (
								<span
									key={s}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pink)] text-white text-xs font-display tracking-widest"
								>
									{s}
								</span>
							))}
						</div>
					</div>
					<FooterCollections />
					<div>
						<h3 className="font-display uppercase tracking-[0.18em] text-[var(--yellow)] text-sm">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--cream)]/80 hover:text-white transition-colors"
								>
									Shop All
								</YnsLink>
							</li>
						</ul>
					</div>
					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-[var(--cream)]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-[var(--cream)]/60">
						&copy; {new Date().getFullYear()} Your Next Store. Made with love and a little gossip.
					</p>
					<p className="text-xs uppercase tracking-[0.3em] text-[var(--cream)]/60">YNS — Boldly Delicious</p>
				</div>
			</div>
			<FooterMarquee />
		</footer>
	);
}
