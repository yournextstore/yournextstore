import { ArrowDownRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { HERO_IMAGE } from "@/lib/editorial";
import { YNSMedia } from "@/lib/yns-media";

async function getProductCount() {
	"use cache";
	cacheLife("minutes");
	const browse = await commerce.productBrowse({ active: true, limit: 1 }).catch(() => null);
	return browse?.meta.count ?? 0;
}

/**
 * Eyesome's banner: a huge two-line title, two lines of grey copy, a dark button and an
 * "Explore More" arrow link; on desktop a rounded photograph on a yellow sweep sits at the right.
 */
export async function Hero() {
	const count = await getProductCount();

	return (
		<section className="relative mb-5 flex items-center justify-between py-1">
			<div className="mx-auto w-full max-w-xl py-2 sm:mx-0 lg:w-1/3 lg:max-w-none">
				<h1 className="w-full py-3 text-display-xs font-semibold sm:text-display-sm lg:text-display">
					Glasses &amp; Lens
				</h1>
				<p className="py-3 text-base text-gray-600">
					Everyday frames, sunglasses and readers, chosen with care.
					{count > 0 && (
						<>
							<br />
							{count} products to choose from.
						</>
					)}
				</p>
				<div className="flex items-center">
					<Link href="/products" className="btn-primary text-sm md:text-base">
						Start Shopping
					</Link>
					<a href="#categories" className="flex items-center p-3 text-sm md:text-base">
						<span className="mx-2">Explore More</span>
						<span className="inline-flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full border-[1.5px] border-current">
							<ArrowDownRight className="h-3 w-3" strokeWidth={2.25} aria-hidden />
						</span>
					</a>
				</div>
			</div>
			<div className="hidden w-1/2 justify-end lg:flex">
				<div className="relative aspect-[350/317] w-2/3 overflow-hidden rounded-[1.75rem] bg-[radial-gradient(120%_90%_at_20%_15%,#fde68a_0%,#facc15_38%,#eab308_70%,#d99a06_100%)]">
					<YNSMedia
						src={HERO_IMAGE.src}
						alt=""
						fill
						priority
						sizes="(min-width: 1024px) 24vw, 1px"
						className="object-cover"
						style={{ objectPosition: HERO_IMAGE.position }}
					/>
				</div>
			</div>
		</section>
	);
}
