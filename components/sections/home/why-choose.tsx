import { LockKeyhole, MailCheck, Sparkles } from "lucide-react";
import { BrandName } from "@/components/wordmark";
import { getStoreInfo } from "@/lib/catalog";

// Plain facts any store on the platform can stand behind: no certifications or claims.
export const FEATURES = [
	{ icon: Sparkles, title: "A Focused Range", description: "Fewer products, chosen with care" },
	{ icon: LockKeyhole, title: "Secure Checkout", description: "Encrypted payments, every order" },
	{ icon: MailCheck, title: "Order Updates", description: "Every step confirmed by email" },
] as const;

export async function WhyChoose() {
	const { storeName } = await getStoreInfo();
	return (
		<section aria-labelledby="why-choose" className="flex flex-col gap-12 pt-16 lg:gap-16 lg:pt-20">
			<h2 id="why-choose" className="section-title px-5 text-center text-[2rem] text-ink lg:text-heading-xl">
				Why <span className="stroke-word">Choose</span> <BrandName name={storeName} className="normal-case" />{" "}
				Products
			</h2>
			<div className="bg-navy">
				<ul className="mx-auto grid max-w-5xl grid-cols-1 gap-y-16 px-6 py-16 text-center text-page lg:grid-cols-3 lg:py-[5.75rem]">
					{FEATURES.map((feature) => (
						<li key={feature.title} className="flex flex-col items-center gap-2">
							<span className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-page text-ink">
								<feature.icon className="h-10 w-10" strokeWidth={1.4} aria-hidden="true" />
							</span>
							<h3 className="font-montserrat text-lg font-bold">{feature.title}</h3>
							<p className="text-sm">{feature.description}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
