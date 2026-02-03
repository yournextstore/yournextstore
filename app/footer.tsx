import { cacheLife } from "next/cache";
import { MaterialIcon } from "@/components/icons/material-icon";
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
		<ul className="space-y-4 text-gray-400 text-sm">
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
		<footer className="bg-background-dark text-white pt-20 pb-10 border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					{/* Brand Column */}
					<div className="space-y-6">
						<YnsLink prefetch={"eager"} href="/" className="flex items-center space-x-2 group">
							<MaterialIcon name="spa" className="text-primary text-4xl" />
							<span className="text-2xl font-bold tracking-wide">Cannabo</span>
						</YnsLink>
						<p className="text-gray-400 text-sm leading-relaxed">
							Premium CBD products derived from organic hemp. Lab-tested for purity and potency to support
							your daily wellness journey.
						</p>
						<div className="flex space-x-4">
							<button
								type="button"
								className="w-10 h-10 rounded-full bg-dark-accent flex items-center justify-center hover:bg-primary transition-colors group"
							>
								<span className="font-bold text-xs group-hover:text-white">FB</span>
							</button>
							<button
								type="button"
								className="w-10 h-10 rounded-full bg-dark-accent flex items-center justify-center hover:bg-primary transition-colors group"
							>
								<span className="font-bold text-xs group-hover:text-white">TW</span>
							</button>
							<button
								type="button"
								className="w-10 h-10 rounded-full bg-dark-accent flex items-center justify-center hover:bg-primary transition-colors group"
							>
								<span className="font-bold text-xs group-hover:text-white">IG</span>
							</button>
							<button
								type="button"
								className="w-10 h-10 rounded-full bg-dark-accent flex items-center justify-center hover:bg-primary transition-colors group"
							>
								<span className="font-bold text-xs group-hover:text-white">YT</span>
							</button>
						</div>
					</div>

					{/* Quick Links Column */}
					<div>
						<h4 className="text-lg font-bold mb-6">Quick Links</h4>
						<ul className="space-y-4 text-gray-400 text-sm">
							<li>
								<YnsLink href="/" className="hover:text-primary transition-colors">
									Shop All
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									Our Lab Results
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									Wholesale
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									Store Locator
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Customer Support Column */}
					<div>
						<h4 className="text-lg font-bold mb-6">Customer Support</h4>
						<ul className="space-y-4 text-gray-400 text-sm">
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									Shipping &amp; Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									Terms of Service
								</YnsLink>
							</li>
							<li>
								<YnsLink href="#" className="hover:text-primary transition-colors">
									Privacy Policy
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Contact Info Column */}
					<div>
						<h4 className="text-lg font-bold mb-6">Contact Info</h4>
						<div className="space-y-4 text-gray-400 text-sm">
							<div className="flex items-start space-x-3">
								<MaterialIcon name="location_on" className="text-primary text-lg mt-1" />
								<span>
									123 Green Street, <br />
									Botanical District, NY 10012
								</span>
							</div>
							<div className="flex items-center space-x-3">
								<MaterialIcon name="phone" className="text-primary text-lg" />
								<span>+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-3">
								<MaterialIcon name="email" className="text-primary text-lg" />
								<span>hello@cannabo.com</span>
							</div>
							<div className="pt-4">
								<h5 className="text-white font-semibold mb-2">Subscribe to Newsletter</h5>
								<div className="flex">
									<input
										className="bg-dark-accent border-none rounded-l-lg py-2 px-4 w-full text-white placeholder-gray-500 focus:ring-1 focus:ring-primary text-sm"
										placeholder="Your email"
										type="email"
									/>
									<button
										type="button"
										className="bg-primary hover:bg-green-600 text-white px-4 rounded-r-lg transition-colors"
									>
										<MaterialIcon name="send" className="text-sm" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
					<p>&copy; {new Date().getFullYear()} Cannabo Inc. All rights reserved.</p>
					<div className="flex space-x-4 mt-4 md:mt-0">
						<div className="h-6 w-10 bg-gray-600 rounded opacity-50" title="Visa" />
						<div className="h-6 w-10 bg-gray-600 rounded opacity-50" title="Mastercard" />
						<div className="h-6 w-10 bg-gray-600 rounded opacity-50" title="PayPal" />
					</div>
				</div>
			</div>
		</footer>
	);
}
