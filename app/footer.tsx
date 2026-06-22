import { Camera, Mail } from "lucide-react";
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
				className="text-sm text-background/80 hover:text-background transition-colors"
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
				className="text-sm text-background/80 hover:text-background transition-colors"
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
			<h3 className="text-xs tracking-[0.22em] uppercase text-muted-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 hover:text-foreground transition-colors"
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
			<h3 className="text-xs tracking-[0.22em] uppercase text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 hover:text-foreground transition-colors"
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
		<footer className="bg-foreground text-background mt-20">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-10">
				{/* Big display word */}
				<p className="yns-display text-background/95 leading-[0.85] tracking-[-0.04em] text-[18vw] sm:text-[14vw] lg:text-[12vw] font-medium">
					<span className="bg-gradient-to-b from-background to-background/30 bg-clip-text text-transparent">
						Your Next Store
					</span>
				</p>

				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 mt-16">
					<div className="col-span-2 md:col-span-2 sm:max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="yns-display text-2xl text-background">
							YNS
						</YnsLink>
						<p className="mt-4 text-sm text-background/70 leading-relaxed">
							A small studio designing objects for slow, considered homes. Built since 2018 in collaboration
							with 112 independent makers.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-background/20 hover:bg-background/10 transition-colors"
								aria-label="Instagram"
							>
								<Camera className="h-4 w-4" />
							</a>
							<a
								href="mailto:hello@yournextstore.com"
								className="inline-flex h-10 items-center gap-2 rounded-full ring-1 ring-background/20 hover:bg-background/10 transition-colors px-4 text-sm"
							>
								<Mail className="h-4 w-4" />
								hello@yournextstore.com
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs tracking-[0.22em] uppercase text-background/50">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/cart"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									Returns
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:care@yournextstore.com"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									Contact us
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-16 pt-6 border-t border-background/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
					<p className="text-xs text-background/50">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs text-background/50 tracking-[0.18em] uppercase">
						Designed quietly · Made to last
					</p>
				</div>
			</div>
		</footer>
	);
}
