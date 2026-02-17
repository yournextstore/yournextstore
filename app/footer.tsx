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
			<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Collections</h3>
			<ul className="mt-4 space-y-2">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-brand transition-colors"
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
			<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Legal</h3>
			<ul className="mt-4 space-y-2">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-white/60 hover:text-brand transition-colors"
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
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-xl font-bold text-white uppercase tracking-wider"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-white/60 leading-relaxed">
							Premium automotive parts and accessories. Quality products for every vehicle, engineered for
							performance.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Customer Service */}
					<div>
						<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
							Customer Service
						</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									Contact Us
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									Shipping &amp; Delivery
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									Returns &amp; Exchanges
								</YnsLink>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-sm text-white/40">
							&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
						</p>
						<div className="flex items-center gap-4">
							<span className="text-xs text-white/40 uppercase tracking-wide">
								Helpline: (+800) 123 456 7890
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
