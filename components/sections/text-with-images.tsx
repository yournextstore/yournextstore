import Image from "next/image";
import { YnsLink } from "../yns-link";

export function TextWithImages() {
	return (
		<section className="py-16 sm:py-24 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-center justify-center gap-4 text-center">
					<span className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">
						Make you look
					</span>

					<YnsLink
						href="/products"
						className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden inline-block shrink-0"
					>
						<Image src="/scraped-5.jpg" alt="Glow" fill className="object-cover" sizes="112px" />
					</YnsLink>

					<span className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">
						and feel glowy
					</span>

					<YnsLink
						href="/products"
						className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden inline-block shrink-0"
					>
						<Image src="/scraped-6.jpg" alt="Healthy" fill className="object-cover" sizes="112px" />
					</YnsLink>

					<span className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">
						and healthy
					</span>

					<YnsLink
						href="/products"
						className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden inline-block shrink-0"
					>
						<Image src="/scraped-9.jpg" alt="Fresh" fill className="object-cover" sizes="112px" />
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
