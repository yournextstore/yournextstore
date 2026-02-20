import { YnsLink } from "../yns-link";

export function MarqueeBanner() {
	return (
		<section className="bg-brand-yellow overflow-hidden py-4">
			<div className="flex animate-marquee whitespace-nowrap">
				{Array.from({ length: 6 }).map((_, i) => (
					<span key={`marquee-${i}`} className="flex items-center mx-4">
						<span className="text-brand-dark font-black uppercase text-lg tracking-wider">
							Final Autumn Sale
						</span>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="ml-4 text-brand-dark text-sm font-bold uppercase border-b-2 border-brand-dark hover:opacity-70 transition-opacity"
						>
							GRAB IT!
						</YnsLink>
						<span className="mx-8 text-brand-dark/30">&#9679;</span>
					</span>
				))}
			</div>
		</section>
	);
}
