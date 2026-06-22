import { CheckCircle2 } from "lucide-react";

const items = ["100% Plant-based", "Real Fruits, Nuts, & Superfoods", "No Preservatives or Added Sugar"];

export function TrustStrip() {
	return (
		<section className="border-y border-brand-ink/10 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
				<ul className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
					{items.map((item) => (
						<li key={item} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
							<CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" strokeWidth={2.25} />
							<span>{item}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
