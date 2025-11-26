import Link from "next/link";

const footerLinks = {
	shop: [
		{ name: "All Products", href: "/products" },
		{ name: "New Arrivals", href: "/new" },
		{ name: "Best Sellers", href: "/best-sellers" },
		{ name: "Sale", href: "/sale" },
	],
	company: [
		{ name: "About Us", href: "/about" },
		{ name: "Contact", href: "/contact" },
		{ name: "Careers", href: "/careers" },
		{ name: "Press", href: "/press" },
	],
	support: [
		{ name: "Help Center", href: "/help" },
		{ name: "Shipping", href: "/shipping" },
		{ name: "Returns", href: "/returns" },
		{ name: "Size Guide", href: "/size-guide" },
	],
	legal: [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
	],
};

export function Footer() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Main footer content */}
				<div className="py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
					{/* Brand column */}
					<div className="col-span-2 sm:col-span-4 lg:col-span-1 lg:pr-8">
						<Link href="/" className="text-xl font-bold text-foreground">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Curated essentials for modern living. Quality products, thoughtfully designed.
						</p>
					</div>

					{/* Shop links */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Shop</h3>
						<ul className="mt-4 space-y-3">
							{footerLinks.shop.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company links */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Company</h3>
						<ul className="mt-4 space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support links */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Support</h3>
						<ul className="mt-4 space-y-3">
							{footerLinks.support.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						{footerLinks.legal.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{link.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
