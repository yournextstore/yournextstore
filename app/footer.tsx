import { Mail } from "lucide-react";
import { cacheLife } from "next/cache";
import { BrandMark } from "@/components/brand-mark";
import { FacebookIcon, InstagramIcon } from "@/components/social-icons";
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
				className="text-sm text-white/75 hover:text-pop-yellow transition-colors"
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
				className="text-sm text-white/75 hover:text-pop-yellow transition-colors"
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
			<h3 className="font-display text-xl uppercase tracking-widest text-pop-yellow">Shop</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/75 hover:text-pop-yellow transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink href="/products" className="text-sm text-white/75 hover:text-pop-yellow transition-colors">
						All products
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
			<h3 className="font-display text-xl uppercase tracking-widest text-pop-yellow">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/75 hover:text-pop-yellow transition-colors"
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
		<footer className="relative overflow-hidden bg-pop-ink text-white">
			<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-10" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-20">
				<div className="grid gap-12 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div>
						<YnsLink prefetch={"eager"} href="/" aria-label="Your Next Store">
							<BrandMark className="h-20 w-auto" />
						</YnsLink>
						<p className="mt-5 max-w-xs text-sm text-white/70 leading-relaxed">
							Hand-poured boozy popsicles in tropical flavors. Drink them straight or plunge them into bubbly
							— either way, you&apos;re the bartender now.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<a
								href="https://instagram.com"
								aria-label="Instagram"
								className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-110"
							>
								<InstagramIcon className="h-4 w-4" />
							</a>
							<a
								href="https://facebook.com"
								aria-label="Facebook"
								className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-110"
							>
								<FacebookIcon className="h-4 w-4" />
							</a>
							<a
								href="mailto:hello@yournextstore.com"
								aria-label="Email"
								className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-110"
							>
								<Mail className="h-4 w-4" />
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display text-xl uppercase tracking-widest text-pop-yellow">Visit</h3>
						<ul className="mt-4 space-y-3 text-sm text-white/75">
							<li>
								<YnsLink prefetch={"eager"} href="/about" className="hover:text-pop-yellow transition-colors">
									About Us
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#about" className="hover:text-pop-yellow transition-colors">
									About
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#stories" className="hover:text-pop-yellow transition-colors">
									Blog
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#collabs" className="hover:text-pop-yellow transition-colors">
									Collabs
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#events" className="hover:text-pop-yellow transition-colors">
									Events
								</YnsLink>
							</li>
							<FooterContactLink />
							<FooterBlogLink />
						</ul>
					</div>

					<div>
						<h3 className="font-display text-xl uppercase tracking-widest text-pop-yellow">Help</h3>
						<ul className="mt-4 space-y-3 text-sm text-white/75">
							<li>
								<YnsLink href="/faq" className="hover:text-pop-yellow transition-colors">
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink href="/cart" className="hover:text-pop-yellow transition-colors">
									Order status
								</YnsLink>
							</li>
							<li>
								<a href="mailto:hello@yournextstore.com" className="hover:text-pop-yellow transition-colors">
									Wholesale
								</a>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-14 rounded-2xl bg-primary/15 border border-primary/30 px-5 py-4 text-center text-[11px] uppercase tracking-[0.22em] font-semibold text-pop-yellow">
					Please drink responsibly · Must be 21+ to purchase · Never drink and drive
				</div>

				<div className="mt-8 flex flex-col gap-3 sm:flex-row items-center justify-between text-xs text-white/55">
					<p>&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.</p>
					<p className="font-display tracking-[0.22em] uppercase">Pop · Plunge · Repeat</p>
				</div>
			</div>
		</footer>
	);
}
