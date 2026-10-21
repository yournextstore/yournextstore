import Image from "next/image";
import Link from "next/link";
import { BtnLabel } from "@/components/grilli/btn-label";
import { SectionHeading } from "@/components/grilli/section-heading";
import { getStoreBasics } from "@/lib/catalog";
import { STORY_IMAGES } from "@/lib/editorial";

/** The rotating seal of the original's "since 1950" badge, redrawn as text on a circle. */
export function FreshSeal({ className }: { className?: string }) {
	return (
		<div className={className}>
			<svg
				viewBox="0 0 134 134"
				className="size-full motion-safe:animate-[grilli-rotate_15s_linear_infinite]"
				aria-hidden="true"
			>
				<defs>
					<path id="seal-ring" d="M67 67m-52 0a52 52 0 1 1 104 0a52 52 0 1 1-104 0" />
				</defs>
				<circle cx="67" cy="67" r="66" fill="none" stroke="var(--gold)" strokeDasharray="2 4" />
				<text fill="var(--gold)" fontSize="11" letterSpacing="3.2" fontWeight="700">
					<textPath href="#seal-ring">FROM OUR KITCHEN • TO YOUR TABLE •</textPath>
				</text>
			</svg>
			<div className="absolute inset-[30px] grid place-content-center rounded-full border border-white/80 text-center">
				<span className="text-[0.625rem] font-bold uppercase tracking-3 text-white">Chef</span>
				<span className="font-display text-[1.75rem] leading-none text-white">Made</span>
			</div>
		</div>
	);
}

/** The original's "Our Story": copy on the left, a photograph collage with the rotating seal on the right. */
export async function Story({ more = true }: { more?: boolean }) {
	const basics = await getStoreBasics();

	return (
		<section
			aria-labelledby="story-title"
			className="relative overflow-hidden py-[70px] text-center lg:py-[100px] xl:pt-[170px]"
		>
			<div className="container-g grid gap-[120px] xs:gap-20 lg:grid-cols-[0.7fr_1fr] lg:items-center lg:gap-[30px]">
				<div className="2xl:pr-[90px]">
					<SectionHeading id="story-title" kicker="Our Story" title="The Larder Behind the Pass" />
					<div className="mx-auto mt-[15px] mb-[30px] max-w-[420px] space-y-3 text-body-4">
						{basics.description && <p>{basics.description}</p>}
						<p>
							We keep the range small: only what our cooks reach for every night, from the first drizzle of
							oil to the bonbons served with coffee.
						</p>
					</div>
					{basics.freeShipping && (
						<>
							<p className="font-bold">Free delivery over</p>
							<Link
								href="/products"
								className="hover-underline mx-auto block text-body-1 text-gold xs:text-[1.875rem]"
							>
								{basics.freeShipping}
							</Link>
						</>
					)}
					<Link href={more ? "/about" : "/products"} className="btn-g mx-auto mt-[26px]">
						<BtnLabel>{more ? "Read More" : "View the Shop"}</BtnLabel>
					</Link>
				</div>
				<figure className="relative mb-[120px]">
					<div className="pl-[50px] xs:pl-[90px]">
						<div className="relative aspect-square overflow-hidden bg-eerie-4">
							<Image
								src={STORY_IMAGES.main}
								alt=""
								fill
								sizes="(min-width: 1200px) 600px, (min-width: 992px) 55vw, 90vw"
								className="object-cover"
							/>
						</div>
					</div>
					<div className="pattern-band absolute -bottom-[120px] left-0 w-[150px] py-[50px] xs:w-[285px]">
						<div className="relative aspect-square overflow-hidden">
							<Image src={STORY_IMAGES.inset} alt="" fill sizes="285px" className="object-cover" />
						</div>
					</div>
					<FreshSeal className="absolute -top-[65px] right-0 size-[134px]" />
				</figure>
			</div>
		</section>
	);
}
