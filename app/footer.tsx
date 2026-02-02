import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
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
			<h3 className="text-sm font-bold text-foreground mb-4">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
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

export function Footer() {
	return (
		<footer className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			<div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Brand Section */}
					<div className="lg:col-span-1">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center font-bold text-xl">
								A
							</div>
							<span className="text-xl font-bold tracking-tight">aura.</span>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed mb-6">
							Elevate your sound with premium audio equipment. Crafted with precision, designed for
							audiophiles.
						</p>
						{/* Social Icons */}
						<div className="flex gap-3">
							<button
								type="button"
								aria-label="Facebook"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Facebook className="w-4 h-4" />
							</button>
							<button
								type="button"
								aria-label="Instagram"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Instagram className="w-4 h-4" />
							</button>
							<button
								type="button"
								aria-label="Twitter"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Twitter className="w-4 h-4" />
							</button>
							<button
								type="button"
								aria-label="Youtube"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Youtube className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-sm font-bold text-foreground mb-4">Support</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/contact"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact Us
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									FAQs
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/shipping"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Shipping Info
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/returns"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Returns
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className="text-sm font-bold text-foreground mb-4">Newsletter</h3>
						<p className="text-sm text-muted-foreground mb-4">Subscribe for exclusive offers and updates.</p>
						<form className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 bg-secondary rounded-full text-sm outline-none focus:ring-2 focus:ring-primary"
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
							>
								Join
							</button>
						</form>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Aura Audio. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<YnsLink
							prefetch={"eager"}
							href="/privacy"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy Policy
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/terms"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms of Service
						</YnsLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
