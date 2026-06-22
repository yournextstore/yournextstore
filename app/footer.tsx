import { Heart, Mail, MapPin } from "lucide-react";
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
				className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
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
				className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
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
				<h3 className="font-display italic text-2xl text-[var(--cream)]">Shop</h3>
				<ul className="mt-5 space-y-3">
					<li>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
						>
							All cookies
						</YnsLink>
					</li>
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="font-display italic text-2xl text-[var(--cream)]">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
					>
						All cookies
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
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
		<>
			{pages.data.map((page) => (
				<li key={page.id}>
					<YnsLink
						prefetch={"eager"}
						href={`/legal${page.href}`}
						className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
					>
						{page.label}
					</YnsLink>
				</li>
			))}
		</>
	);
}

export function Footer() {
	return (
		<footer className="bg-[var(--ink)] text-[var(--cream)] relative overflow-hidden">
			{/* Top heart scallop */}
			<div
				aria-hidden="true"
				className="h-6 bg-[var(--ink)]"
				style={{
					maskImage: "radial-gradient(circle 12px at 12px 0, transparent 11px, black 12px)",
					maskSize: "24px 24px",
					maskRepeat: "repeat-x",
					backgroundColor: "var(--maroon)",
				}}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="inline-block">
							<span className="font-script text-4xl text-white">Your Next Store</span>
							<span className="block text-[10px] tracking-[0.35em] text-[var(--cream)]/70 mt-0.5 font-medium">
								BAKING CO.
							</span>
						</YnsLink>
						<p className="mt-5 text-sm text-[var(--cream)]/75 leading-relaxed">
							Small-batch, butter-real cookies and gifts — baked, packed, and ribboned by hand. Sweet mail
							welcomed.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noreferrer noopener"
								className="w-10 h-10 rounded-full bg-[var(--maroon)] text-white flex items-center justify-center hover:bg-[var(--candy)] transition-colors"
								aria-label="Instagram"
							>
								<Heart className="w-4 h-4" />
							</a>
							<a
								href="mailto:hello@yournextstore.com"
								className="w-10 h-10 rounded-full bg-[var(--maroon)] text-white flex items-center justify-center hover:bg-[var(--candy)] transition-colors"
								aria-label="Email"
							>
								<Mail className="w-4 h-4" />
							</a>
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-[var(--maroon)] text-white flex items-center justify-center hover:bg-[var(--candy)] transition-colors"
								aria-label="Store locator"
							>
								<MapPin className="w-4 h-4" />
							</a>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="font-display italic text-2xl text-[var(--cream)]">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors">
									Shipping
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors">
									Gift cards
								</a>
							</li>
						</ul>
					</div>

					{/* Legal & company */}
					<div>
						<h3 className="font-display italic text-2xl text-[var(--cream)]">Company</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<a
									href="#story"
									className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
								>
									Our story
								</a>
							</li>
							<li>
								<a
									href="#recipes"
									className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
								>
									Recipes
								</a>
							</li>
							<li>
								<a
									href="#sustainability"
									className="text-sm text-[var(--cream)]/75 hover:text-white transition-colors"
								>
									Sustainability
								</a>
							</li>
							<FooterLegalPages />
						</ul>
					</div>
				</div>

				{/* Wordmark stripe */}
				<div className="py-10 border-t border-white/10">
					<p className="font-script text-center text-[14vw] sm:text-[12vw] lg:text-[10vw] leading-none text-[var(--maroon)]/60 select-none">
						baked with love
					</p>
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
					<p className="text-xs tracking-[0.15em] uppercase text-[var(--cream)]/55">
						&copy; {new Date().getFullYear()} Your Next Store Baking Co. All rights reserved.
					</p>
					<p className="text-xs tracking-[0.15em] uppercase text-[var(--cream)]/55">
						Hand-baked in the U.S.A.
					</p>
				</div>
			</div>
		</footer>
	);
}
