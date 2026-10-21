import Link from "next/link";
import { BtnLabel } from "@/components/grilli/btn-label";
import { getHomeMenu } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** The original's "Special Dish", as a featured product: a photograph half and a copy half with the struck-through price. */
export async function SpecialDish() {
	const { special } = await getHomeMenu();
	if (!special) return null;

	return (
		<section aria-labelledby="special-title" className="text-center lg:grid lg:grid-cols-2 lg:text-left">
			<div className="relative aspect-[940/900] overflow-hidden bg-eerie-4 lg:aspect-auto">
				{special.image && (
					<YNSMedia
						src={special.image}
						alt=""
						fill
						sizes="(min-width: 992px) 50vw, 100vw"
						className="object-cover"
					/>
				)}
			</div>
			<div className="bg-smoky-2 py-[70px] lg:px-[50px] lg:pr-[25px] xl:px-[120px] xl:py-[225px] xl:pr-0">
				<div className="container-g relative lg:max-w-none xl:mx-0 xl:max-w-[460px]">
					<svg
						viewBox="0 0 28 41"
						className="mx-auto mb-3 h-[41px] w-[28px] lg:absolute lg:top-2.5 lg:-left-10 lg:mx-0 lg:motion-safe:animate-[grilli-move_5s_linear_infinite]"
						aria-hidden="true"
					>
						<path d="M0 0h28v41l-14-9-14 9Z" fill="var(--gold)" />
						<path
							d="m14 9 2.4 4.9 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.9-3.8 5.4-.8Z"
							fill="var(--smoky)"
						/>
					</svg>
					<p className="section-subtitle lg:after:mx-0">Chef's Choice</p>
					<h2 id="special-title" className="font-display text-headline-1 text-white">
						{special.name}
					</h2>
					{special.summary && <p className="mt-4 mb-10 line-clamp-4 text-body-4">{special.summary}</p>}
					<div className="mb-10 flex items-center justify-center gap-5 lg:justify-start">
						{special.compareAt && (
							<del className="text-body-3 text-silver">
								<span className="sr-only">Was </span>
								{special.compareAt}
							</del>
						)}
						{special.price && <span className="text-body-1 text-gold">{special.price}</span>}
					</div>
					<Link href={`/product/${special.slug}`} className="btn-g mx-auto lg:mx-0">
						<BtnLabel>Shop Now</BtnLabel>
					</Link>
				</div>
			</div>
		</section>
	);
}
