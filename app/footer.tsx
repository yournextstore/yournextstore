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
				className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
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
				className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
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
			<h3 className="text-[11px] tracking-arame uppercase text-bone/55 mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
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
			<h3 className="text-[11px] tracking-arame uppercase text-bone/55 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialIcons() {
	const items = [
		{
			label: "Instagram",
			path: (
				<>
					<rect x="3" y="3" width="18" height="18" rx="4" />
					<circle cx="12" cy="12" r="3.5" />
					<circle cx="17" cy="7" r="0.6" fill="currentColor" />
				</>
			),
		},
		{
			label: "Pinterest",
			path: (
				<>
					<circle cx="12" cy="12" r="9" />
					<path d="M11 7c2 0 4 1 4 3.5 0 2.5-2 4-3.5 4-0.7 0-1.3-0.3-1.5-0.7M10 21l1.5-7" />
				</>
			),
		},
		{
			label: "TikTok",
			path: (
				<>
					<path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
					<path d="M14 4c0 2 1.5 4 4 4" />
				</>
			),
		},
	];
	return (
		<div className="flex gap-4">
			{items.map((it) => (
				<a
					key={it.label}
					href="#"
					aria-label={it.label}
					className="text-bone/65 hover:text-bone transition-colors"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
						{it.path}
					</svg>
				</a>
			))}
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-cocoa text-bone">
			<div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
				<div className="py-20 grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8">
					<div className="col-span-2 md:col-span-4">
						<div className="font-serif tracking-arame uppercase text-base">Your Next Store</div>
						<p className="mt-1 text-[10px] tracking-[0.45em] uppercase text-bone/55">Est · Daily Ritual</p>
						<p className="mt-7 font-serif italic text-base text-bone/75 leading-relaxed max-w-xs">
							A quiet ritual for daily care — botanically grounded, clinically considered, kept slow on
							purpose.
						</p>
						<div className="mt-8">
							<SocialIcons />
						</div>
					</div>

					<div className="col-span-1 md:col-span-2 md:col-start-6">
						<FooterCollections />
					</div>

					<div className="col-span-1 md:col-span-2">
						<h3 className="text-[11px] tracking-arame uppercase text-bone/55 mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#story"
									className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="font-serif text-base text-bone/85 hover:text-bone transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>

					<div className="col-span-2 md:col-span-2">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-7 border-t border-bone/15 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
					<p className="text-[10px] tracking-arame uppercase text-bone/55">
						&copy; {new Date().getFullYear()} Your Next Store — All rights reserved
					</p>
					<p className="font-serif italic text-sm text-bone/55">
						Composed with care · Shipped from our atelier
					</p>
				</div>
			</div>
		</footer>
	);
}
