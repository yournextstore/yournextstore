import Link from "next/link";
import { editorialImages } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** Solace hero: a letterbox lifestyle photograph, then the headline with the CTA and a right-set intro. */
export function Hero() {
	const image = editorialImages.hero;

	return (
		<section>
			<div className="relative h-[10.5rem] w-full bg-secondary sm:h-[23rem] huge:h-[29.25rem]">
				<YNSMedia
					src={image.src}
					alt={image.alt}
					fill
					priority
					sizes="100vw"
					className="object-cover object-[50%_55%]"
				/>
			</div>
			<div className="shell flex flex-col gap-2 py-6 sm:gap-8 sm:py-10">
				<h1 className="max-w-full text-heading-lg sm:max-w-[32rem] md:text-heading-xl">
					Low, soft furniture for calm rooms
				</h1>
				<div className="flex flex-col-reverse justify-between gap-8 md:flex-row md:items-center">
					<Link href="/products" className="pill w-max">
						Explore now
					</Link>
					<p className="max-w-full text-lead md:max-w-[25.625rem] md:text-end">
						Sofas, lounge chairs, solid ash dining pieces and travertine tables, sold direct and sized for
						real homes.
					</p>
				</div>
			</div>
		</section>
	);
}
