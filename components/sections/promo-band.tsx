import Link from "next/link";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * PromoSectionLarge: a photograph under a 60% black mask with a centred white headline, lead
 * and a white button. The store's photos are 2:3 portraits, so a wide band shows three of them
 * side by side (one on phones) instead of blowing a single portrait up into a giant crop.
 */
export function PromoBand({
	title,
	text,
	cta,
	href,
	images,
	priority = false,
	tall = false,
	rounded = false,
	headingLevel = 2,
}: {
	title: string;
	text?: string | null;
	cta: string;
	href: string;
	images: string[];
	priority?: boolean;
	/** 90vh landing hero instead of the 50vh band. */
	tall?: boolean;
	rounded?: boolean;
	headingLevel?: 1 | 2;
}) {
	const Heading = headingLevel === 1 ? "h1" : "h2";
	return (
		<section
			className={cn(
				"relative isolate flex items-center overflow-hidden bg-slate-ink py-16 md:py-0",
				tall ? "min-h-[min(90vh,52rem)] md:min-h-[90vh]" : "min-h-[50vh]",
				rounded && "rounded-2xl",
			)}
		>
			<div aria-hidden className="absolute inset-0 -z-10 grid grid-cols-1 md:grid-cols-3">
				{images.slice(0, 3).map((src, index) => (
					<div key={src} className={cn("relative", index > 0 && "hidden md:block")}>
						<YNSMedia
							src={src}
							alt=""
							fill
							priority={priority && index === 0}
							sizes="(max-width: 768px) 100vw, 34vw"
							className="object-cover object-[50%_25%]"
						/>
					</div>
				))}
				<span className="mask-ae" />
			</div>
			<div className="container-ae">
				<div className="mx-auto max-w-[44rem] text-center">
					<Heading className="mb-4 text-[2.25rem] font-bold leading-tight text-white sm:text-5xl">
						{title}
					</Heading>
					{text && (
						<p className="mb-6 line-clamp-4 text-lg leading-relaxed text-white sm:mb-10 sm:text-xl">{text}</p>
					)}
					<Link href={href} className="btn-ae btn-ae-white btn-ae-lg">
						{cta}
					</Link>
				</div>
			</div>
		</section>
	);
}
