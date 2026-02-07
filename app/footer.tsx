import { Diamond, Mail, MapPin, Phone } from "lucide-react";
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
			<h3 className="text-xs tracking-[0.2em] uppercase text-primary mb-6">Collections</h3>
			<ul className="space-y-4">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
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
		<footer className="border-t border-border/50 bg-background">
			{/* Newsletter Section */}
			<div className="border-b border-border/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="text-center max-w-xl mx-auto">
						<Diamond className="h-6 w-6 text-primary mx-auto mb-4" />
						<h3 className="text-2xl font-serif font-light text-foreground mb-3">Join Our World</h3>
						<p className="text-sm text-muted-foreground mb-8">
							Receive exclusive previews, private event invitations, and early access to new collections.
						</p>
						<form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 h-12 px-4 bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
							/>
							<button
								type="submit"
								className="h-12 px-8 bg-primary text-primary-foreground text-xs tracking-[0.15em] uppercase font-medium hover:bg-primary/90 transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand */}
					<div className="lg:col-span-1">
						<YnsLink prefetch={"eager"} href="/" className="flex flex-col">
							<span className="text-2xl font-serif tracking-[0.15em] text-primary">LUMIERE</span>
							<span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Fine Jewelry</span>
						</YnsLink>
						<p className="mt-6 text-sm text-muted-foreground leading-relaxed">
							Crafting moments of brilliance since 1999. Each piece is a testament to our dedication to exceptional artistry.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Customer Care */}
					<div>
						<h3 className="text-xs tracking-[0.2em] uppercase text-primary mb-6">Customer Care</h3>
						<ul className="space-y-4">
							<li><YnsLink prefetch={"eager"} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">Shipping & Returns</YnsLink></li>
							<li><YnsLink prefetch={"eager"} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">Care Guide</YnsLink></li>
							<li><YnsLink prefetch={"eager"} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">Ring Size Guide</YnsLink></li>
							<li><YnsLink prefetch={"eager"} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">Book Consultation</YnsLink></li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-xs tracking-[0.2em] uppercase text-primary mb-6">Visit Us</h3>
						<ul className="space-y-4 text-sm text-muted-foreground">
							<li className="flex items-start gap-3">
								<MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
								<span>123 Fifth Avenue<br />New York, NY 10010</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-4 w-4 text-primary shrink-0" />
								<span>+1 (555) 123-4567</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-4 w-4 text-primary shrink-0" />
								<span>hello@lumiere.com</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {new Date().getFullYear()} Lumiere Fine Jewelry. All rights reserved.
					</p>
					<div className="flex items-center gap-6 text-xs text-muted-foreground">
						<YnsLink prefetch={"eager"} href="#" className="hover:text-primary transition-colors">Privacy</YnsLink>
						<YnsLink prefetch={"eager"} href="#" className="hover:text-primary transition-colors">Terms</YnsLink>
						<YnsLink prefetch={"eager"} href="#" className="hover:text-primary transition-colors">Accessibility</YnsLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
