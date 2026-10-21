import Image from "next/image";
import Link from "next/link";
import { ArrowLongRightIcon } from "@/components/icons";

/**
 * The tinted band with a tall portrait that rises out of it on desktop: "A new shopping
 * experience" on the left, the photograph in the right five columns.
 */
export function ExploreBanner() {
	return (
		<section className="mb-12 py-12 md:pt-28">
			<div className="relative bg-tint md:py-12">
				<div className="container-wide relative md:static">
					<div className="relative z-10 py-12 md:w-1/2 md:py-36">
						<h2 className="mb-6 max-w-[20rem] text-display-3 font-light">A calmer skincare routine</h2>
						<Link href="/products" className="arrow-link">
							Explore products
							<ArrowLongRightIcon className="size-6" />
						</Link>
					</div>
				</div>
				<div className="md:absolute md:right-0 md:bottom-0 md:w-[41.6667%] md:max-w-[600px] lg:w-[min(41.6667%,600px)]">
					<div className="relative aspect-square md:aspect-[5/9] lg:aspect-[25/36] xl:aspect-[25/28]">
						<Image
							src="/images/pexels/explore-totes.jpg"
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 42vw"
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
