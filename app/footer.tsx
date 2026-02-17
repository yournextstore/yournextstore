import { cacheLife } from "next/cache";
import { NewsletterForm } from "@/components/newsletter-form";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">
				Collections
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-white transition-colors"
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
			<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">About</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-white/60 hover:text-white transition-colors"
						>
							{page.title}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/search"
						className="text-sm text-white/60 hover:text-white transition-colors"
					>
						Search
					</YnsLink>
				</li>
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-stone-900 text-white">
			{/* Newsletter bar */}
			<div className="border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
						<div>
							<h3 className="font-heading text-lg font-semibold tracking-wide">Sign up and save</h3>
							<p className="mt-1 text-sm text-white/60">
								Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
							</p>
						</div>
						<NewsletterForm />
					</div>
				</div>
			</div>

			{/* Main footer */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-lg font-semibold tracking-wider uppercase text-white"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-white/60 leading-relaxed">
							Adventure apparel for the modern explorer. Durable, sustainable, made with care.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* About / Legal */}
					<FooterLegalPages />

					{/* Pickup info */}
					<div>
						<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">
							Local pickup available
						</h3>
						<div className="text-sm text-white/60 space-y-1">
							<p>301 Front St W</p>
							<p>Toronto, Canada</p>
							<p className="pt-2">Mon - Fri, 8:30am - 10:30pm</p>
							<p>Saturday, 8:30am - 10:30pm</p>
							<p>Sunday, 8:30am - 10:30pm</p>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10">
					<p className="text-xs text-white/40">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
