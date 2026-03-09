import Image from "next/image";
import { YnsLink } from "../yns-link";

export function BrandStory() {
	return (
		<section className="bg-secondary">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Text content */}
					<div>
						<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
							Created and designed by
						</span>
						<h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-wide mt-3 mb-6">
							Your Next Store
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
							A project rooted in a passion for design, Your Next Store isn&apos;t about reinventing the
							wheel, but about creating for its own sake, and making better versions of the products we want
							to own and use.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="inline-flex items-center border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
						>
							Learn more
						</YnsLink>
					</div>

					{/* Images */}
					<div className="grid grid-cols-2 gap-4">
						<div className="relative aspect-[3/4] overflow-hidden">
							<Image
								src="/scraped-14.png"
								alt="Product detail"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 50vw, 25vw"
							/>
						</div>
						<div className="relative aspect-[3/4] overflow-hidden">
							<Image
								src="/scraped-0.png"
								alt="Product in use"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 50vw, 25vw"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
