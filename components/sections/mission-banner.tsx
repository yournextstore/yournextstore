import { YnsLink } from "@/components/yns-link";

export function MissionBanner() {
	return (
		<section className="bg-secondary py-20 sm:py-28">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-light">
					Our Mission
				</span>
				<h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider mt-6 leading-relaxed">
					Simple, beautiful objects that combine form and function
				</h2>
				<YnsLink
					prefetch={"eager"}
					href="/"
					className="inline-block mt-8 text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
				>
					Learn more
				</YnsLink>
			</div>
		</section>
	);
}
