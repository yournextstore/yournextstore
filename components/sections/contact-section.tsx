import { YnsLink } from "../yns-link";

export function ContactSection() {
	return (
		<section className="py-20 sm:py-28 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
						Get in contact
					</h2>
					<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
						Latest news, musings, announcements and updates direct to your inbox.
					</p>
					<div className="mt-8">
						<YnsLink
							prefetch={"eager"}
							href="#"
							className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-10 py-4 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
						>
							Explore now
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
