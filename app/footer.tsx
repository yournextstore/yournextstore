import { cacheLife } from "next/cache";
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
			<h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Collections</h3>
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
			<h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">About</h3>
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
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-[#1a1a1a] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand */}
					<div>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-xl tracking-wide uppercase font-bold text-white"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-white/50 leading-relaxed">
							Adventure apparel for the modern explorer. Durable, sustainable, made in America.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal/About */}
					<FooterLegalPages />

					{/* Newsletter */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
							Sign up and save
						</h3>
						<p className="text-sm text-white/50 mb-4">
							Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
						</p>
						<form className="flex" action="#">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 h-10 px-3 bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
							/>
							<button
								type="submit"
								className="h-10 px-4 bg-white text-[#1a1a1a] text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors"
							>
								Subscribe
							</button>
						</form>
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
