import { NewsletterForm } from "@/components/newsletter-form";

export function Newsletter() {
	return (
		<section className="py-16 sm:py-24 bg-[#ffda22]">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10 text-center">
				<h2 className="font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black mb-4">
					Sign up to our newsletter
				</h2>
				<p className="text-black/70 text-lg mb-8 max-w-md mx-auto">
					Receive special offers and first look at new products.
				</p>
				<NewsletterForm />
			</div>
		</section>
	);
}
