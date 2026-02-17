export function Newsletter() {
	return (
		<section className="bg-[#f5f5f0] py-16 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Newsletter signup */}
					<div>
						<h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Sign up and save</h2>
						<p className="text-muted-foreground mb-6">
							Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
						</p>
						<form className="flex max-w-md" action="#">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 h-12 px-4 bg-white border border-border text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
							/>
							<button
								type="submit"
								className="h-12 px-6 bg-foreground text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-foreground/90 transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>

					{/* Store info */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-widest mb-4">Local pickup available</h3>
						<p className="text-muted-foreground text-sm mb-1">301 Front St W</p>
						<p className="text-muted-foreground text-sm mb-4">Toronto, Canada</p>
						<div className="space-y-1 text-sm text-muted-foreground">
							<p>Mon - Fri, 8:30am - 10:30pm</p>
							<p>Saturday, 8:30am - 10:30pm</p>
							<p>Sunday, 8:30am - 10:30pm</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
