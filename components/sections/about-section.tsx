import Image from "next/image";
import { YnsLink } from "../yns-link";

export function AboutSection() {
	return (
		<section className="bg-foreground text-primary-foreground">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
				<div className="text-center mb-12">
					<h2 className="text-2xl sm:text-3xl font-medium mb-3">Get to Know Us</h2>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-xs tracking-[0.2em] uppercase text-primary-foreground/70 hover:text-primary-foreground transition-colors border-b border-primary-foreground/30 pb-1"
					>
						More info
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
					{/* Image */}
					<div className="relative aspect-[4/5] overflow-hidden">
						<Image
							src="/scraped-9.png"
							alt="About Your Next Store"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>

					{/* Text content */}
					<div className="lg:pt-8">
						<h3 className="text-xl font-medium uppercase tracking-wide mb-6">Your Next Store</h3>
						<div className="space-y-4 text-primary-foreground/70 text-sm leading-relaxed">
							<p>
								Your Next Store is a modern fashion platform founded with a singular vision: to merge function
								with fashion. Based on an initiative to reinterpret classic outerwear in a novel way, the
								company has grown into an accomplished international brand.
							</p>
							<p>
								Along with reinvented classics, Your Next Store today offers a full line of outerwear, bags
								and accessories to the fashion-conscious consumer. From our headquarters, we develop new
								additions to the expanding collection and manage worldwide distribution.
							</p>
							<p>
								Inspired by both Scandinavian weather and design heritage, we merge traditional methods with
								innovative techniques to create understated and considered pieces made to last beyond the
								season.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
