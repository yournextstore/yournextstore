import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

// Social Icons
function InstagramIcon() {
	return (
		<svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
			<path
				clipRule="evenodd"
				d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.484 2h.08zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.667a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function PinterestIcon() {
	return (
		<svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
			<path
				clipRule="evenodd"
				d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.858-2.433-4.59 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.133-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function FacebookIcon() {
	return (
		<svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
			<path
				clipRule="evenodd"
				d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
				fillRule="evenodd"
			/>
		</svg>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<ul className="space-y-4 text-sm text-muted-foreground font-medium">
			{collections.data.map((collection) => (
				<li key={collection.id}>
					<YnsLink
						prefetch={"eager"}
						href={`/collection/${collection.slug}`}
						className="hover:text-primary transition-colors"
					>
						{collection.name}
					</YnsLink>
				</li>
			))}
		</ul>
	);
}

export function Footer() {
	return (
		<footer className="bg-background pt-20 pb-10 px-6 md:px-12 border-t border-border text-foreground">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
				{/* Brand section */}
				<div className="md:col-span-4 pr-8">
					<h3 className="font-display text-3xl font-bold mb-6">Skinclean.</h3>
					<p className="text-muted-foreground mb-8 font-light max-w-sm">
						Clean, organic, and high-tech skincare designed to reveal your most radiant self. Elevate your
						daily ritual.
					</p>
					<div className="flex space-x-4">
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
							aria-label="Instagram"
						>
							<InstagramIcon />
						</a>
						<a
							href="https://pinterest.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
							aria-label="Pinterest"
						>
							<PinterestIcon />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
							aria-label="Facebook"
						>
							<FacebookIcon />
						</a>
					</div>
				</div>

				{/* Shop links */}
				<div className="md:col-span-2">
					<h4 className="font-display font-semibold mb-6">Shop</h4>
					<FooterCollections />
				</div>

				{/* Information links */}
				<div className="md:col-span-2">
					<h4 className="font-display font-semibold mb-6">Information</h4>
					<ul className="space-y-4 text-sm text-muted-foreground font-medium">
						<li>
							<YnsLink href="/#philosophy" className="hover:text-primary transition-colors">
								About Us
							</YnsLink>
						</li>
						<li>
							<YnsLink href="/ingredients" className="hover:text-primary transition-colors">
								Ingredients
							</YnsLink>
						</li>
						<li>
							<YnsLink href="/sustainability" className="hover:text-primary transition-colors">
								Sustainability
							</YnsLink>
						</li>
						<li>
							<YnsLink href="/faq" className="hover:text-primary transition-colors">
								FAQ
							</YnsLink>
						</li>
					</ul>
				</div>

				{/* Newsletter */}
				<div className="md:col-span-4">
					<h4 className="font-display font-semibold mb-6">Stay Connected</h4>
					<p className="text-sm text-muted-foreground mb-6 font-light">
						Subscribe to receive updates on new products, exclusive offers, and skincare tips.
					</p>
					<form className="flex flex-col space-y-3">
						<div className="relative">
							<input
								type="email"
								placeholder="Your email address"
								className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder-muted-foreground"
							/>
						</div>
						<button
							type="button"
							className="self-start text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors mt-2"
						>
							Subscribe
						</button>
					</form>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
				<p>&copy; {new Date().getFullYear()} Skinclean. All rights reserved.</p>
				<div className="flex space-x-6 mt-4 md:mt-0">
					<YnsLink href="/privacy" className="hover:text-foreground">
						Privacy Policy
					</YnsLink>
					<YnsLink href="/terms" className="hover:text-foreground">
						Terms of Use
					</YnsLink>
				</div>
			</div>
		</footer>
	);
}
