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
			<h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Home</h3>
			<ul className="mt-4 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Products
					</YnsLink>
				</li>
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Home
					</YnsLink>
				</li>
				{collections.data.slice(0, 3).map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Support</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<YnsLink prefetch={"eager"} href="/" className="text-xl font-bold text-foreground tracking-tight">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							Discover what we are doing to achieve our mission responsibly and enjoy your positive life
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Payment */}
					<div>
						<h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Payment methods</h3>
						<div className="mt-4 flex flex-wrap gap-2">
							{["Visa", "Mastercard", "Amex", "PayPal"].map((method) => (
								<span
									key={method}
									className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-md"
								>
									{method}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<YnsLink
							prefetch={"eager"}
							href="#"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy policy
						</YnsLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
