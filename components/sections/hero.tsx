import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BANNER_IMAGES } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's banner: a 400px panel with the copy on the left and the picture filling the
 * right half. The original's model photographs have no licence, so bundled banner photographs
 * (or a merchant's own collection/category image) take their place, on a warm grey panel.
 */
export function Banner({
	children,
	image,
	priority = true,
}: {
	children: ReactNode;
	image: { src: string; alt: string } | null;
	priority?: boolean;
}) {
	return (
		<section className="flex flex-col bg-[#ebe8e3] md:h-[400px] md:flex-row">
			<div className="flex flex-col items-start justify-center px-4 py-12 md:basis-1/2 md:p-[50px]">
				{children}
			</div>
			{image && (
				<div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:h-full md:basis-1/2">
					<YNSMedia
						src={image.src}
						alt={image.alt}
						fill
						priority={priority}
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover md:translate-x-[50px]"
					/>
				</div>
			)}
		</section>
	);
}

export const BANNER_TITLE =
	"text-[2.5rem] font-medium leading-[1.15] text-foreground md:w-[80%] md:text-sal-hero";

export function Hero() {
	return (
		<Banner image={BANNER_IMAGES.home}>
			<h1 className={BANNER_TITLE.replace("font-medium", "font-normal")}>
				<strong className="font-bold">See</strong> everything <br className="hidden md:inline" />
				with <strong className="font-bold">Clarity</strong>
			</h1>
			<p className="mt-6 max-w-[27rem] text-sal-nav font-bold leading-6 text-paragraph md:mt-8">
				Buying glasses should leave you happy, good-looking and with money in your pocket. Optical frames,
				sunglasses and readers, all in one place.
			</p>
			<Link href="/products" className="sal-btn sal-btn-lg mt-8 text-sal-nav">
				Shop Now
				<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
			</Link>
		</Banner>
	);
}
