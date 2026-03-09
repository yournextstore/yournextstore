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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground mb-6">
				Collections
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground mb-6">
				Legal
			</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
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
		<footer className="bg-foreground text-primary-foreground">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
					{/* Brand */}
					<div className="lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-2xl font-semibold text-primary-foreground tracking-tight"
						>
							YNS
						</YnsLink>
						<p className="mt-4 text-xs text-primary-foreground/50 leading-relaxed max-w-xs">
							Fashion-forward essentials for every season. Curated collections, thoughtfully designed for the
							modern wardrobe.
						</p>
						<div className="mt-6 flex items-center gap-4">
							<span className="w-8 h-8 flex items-center justify-center border border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors cursor-pointer">
								<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
							</span>
							<span className="w-8 h-8 flex items-center justify-center border border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors cursor-pointer">
								<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</span>
							<span className="w-8 h-8 flex items-center justify-center border border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors cursor-pointer">
								<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
								</svg>
							</span>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Customer Service */}
					<div>
						<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground mb-6">
							Customer Service
						</h3>
						<ul className="space-y-3">
							{["Contact Us", "Shipping Info", "Returns & Exchanges", "FAQs", "Size Guide"].map((item) => (
								<li key={item}>
									<span className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors cursor-pointer">
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Legal + Newsletter */}
					<div>
						<FooterLegalPages />
						<div className="mt-8">
							<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground mb-4">
								Newsletter
							</h3>
							<p className="text-xs text-primary-foreground/50 mb-3">
								Subscribe for updates and exclusive offers.
							</p>
							<div className="flex">
								<input
									type="email"
									placeholder="Your email"
									className="flex-1 bg-transparent border border-primary-foreground/20 px-3 py-2 text-xs text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/50"
								/>
								<button
									type="button"
									className="bg-primary-foreground text-foreground px-4 py-2 text-xs uppercase tracking-wider hover:bg-primary-foreground/90 transition-colors"
								>
									Join
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-primary-foreground/10">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-[10px] text-primary-foreground/30 tracking-wider uppercase">
							&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
						</p>
						<div className="flex items-center gap-6">
							{["Visa", "Mastercard", "Amex", "PayPal"].map((payment) => (
								<span
									key={payment}
									className="text-[10px] text-primary-foreground/20 tracking-wider uppercase"
								>
									{payment}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
