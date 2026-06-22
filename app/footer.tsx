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
				className="text-sm text-white/60 transition-colors hover:text-white"
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
				className="text-sm text-white/60 transition-colors hover:text-white"
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
			<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
			<ul className="mt-4 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-white/60 transition-colors hover:text-white"
					>
						Shop All
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 transition-colors hover:text-white"
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
			<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/60 transition-colors hover:text-white"
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
		<footer className="bg-brand-dark text-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-8 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-4">
					{/* Brand */}
					<div>
						<YnsLink prefetch={"eager"} href="/" className="font-heading text-2xl font-bold text-white">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm leading-relaxed text-white/60">
							We blend nature and science to create effective, ethical skincare. Our high-quality products
							nourish and enhance your natural beauty.
						</p>
					</div>

					{/* Collections / Quick Links */}
					<FooterCollections />

					{/* Legal / Support */}
					<FooterLegalPages />

					{/* Company */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-white/60 transition-colors hover:text-white"
								>
									Our Story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/60 transition-colors hover:text-white"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/60 transition-colors hover:text-white"
								>
									Shop
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="border-t border-white/10 py-6">
					<p className="text-sm text-white/40">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
