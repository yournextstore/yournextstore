import { cacheLife } from "next/cache";
import { WipMonogram } from "@/components/wip-monogram";
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
				className="text-sm text-background/70 transition-colors hover:text-background"
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
				className="text-sm text-background/70 transition-colors hover:text-background"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zap">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-background/70 transition-colors hover:text-background"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-background/70 transition-colors hover:text-background"
					>
						All Products
					</YnsLink>
				</li>
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zap">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-background/70 transition-colors hover:text-background"
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
		<footer className="relative overflow-hidden bg-foreground text-background">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-20"
				style={{
					backgroundImage: "radial-gradient(circle, #f1f23b 1px, transparent 1.2px)",
					backgroundSize: "26px 26px",
					maskImage: "linear-gradient(180deg, black 0%, transparent 60%)",
					WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 60%)",
				}}
			/>
			<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				{/* Top giant wordmark */}
				<div className="border-b border-background/15 py-10 sm:py-14">
					<p className="font-display text-[18vw] uppercase leading-none tracking-tight text-background sm:text-[14vw] lg:text-[10rem]">
						Your Next Store.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<YnsLink prefetch={"eager"} href="/" aria-label="Your Next Store" className="inline-flex">
							<WipMonogram className="h-9 w-auto text-zap" />
						</YnsLink>
						<p className="mt-5 max-w-sm text-sm leading-relaxed text-background/65">
							Natural caffeine energy pouches engineered for clean focus. Crafted in small batches. Built for
							the long days.
						</p>
						<p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-background/40">
							hello@yournextstore.com
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zap">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									The Science
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									Responsible Caffeine
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col items-start justify-between gap-3 border-t border-background/15 py-6 sm:flex-row sm:items-center">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-background/50">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-background/40">
						Consume responsibly · Not for under 18
					</p>
				</div>
			</div>
		</footer>
	);
}
