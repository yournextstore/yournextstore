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
			<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Menu</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/80 hover:text-white transition-colors"
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
			<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-white/80 hover:text-white transition-colors"
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
		<footer className="bg-navy text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand */}
					<div>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-[family-name:var(--font-playfair)] text-xl tracking-wide text-white"
						>
							Your Next Store
						</YnsLink>
						<div className="mt-6 flex items-center gap-4">
							<span className="text-sm text-white/60">Follow us</span>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Newsletter */}
					<div>
						<h3 className="text-xs tracking-widest uppercase text-white/60 mb-6">Sign up and save</h3>
						<p className="text-sm text-white/70 mb-4">
							Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
						</p>
						<form className="flex" onSubmit={(e) => e.preventDefault()}>
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
							/>
							<button
								type="submit"
								className="px-4 py-2.5 bg-white/20 text-white text-sm hover:bg-white/30 transition-colors border border-white/20 border-l-0"
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
