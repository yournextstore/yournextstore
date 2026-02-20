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
			<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Products</h3>
			<ul className="mt-4 space-y-2">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						All Products
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
			<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Shopping</h3>
			<ul className="mt-4 space-y-2">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
		<footer className="bg-secondary/50 border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-10 sm:py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
					{/* Legal / Shopping links */}
					<FooterLegalPages />

					{/* Product Collections */}
					<FooterCollections />

					{/* Account */}
					<div>
						<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Account</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/cart"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Cart
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Browse Products
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Information */}
					<div>
						<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Information</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<span className="text-sm text-muted-foreground">FAQ</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">Contact</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
					<p className="text-xs text-muted-foreground">
						Your Next Store &copy; {new Date().getFullYear()}. All rights reserved.
					</p>
					<p className="text-xs text-muted-foreground">
						Email:{" "}
						<a href="mailto:shop@yournextstore.com" className="hover:text-primary transition-colors">
							shop@yournextstore.com
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
