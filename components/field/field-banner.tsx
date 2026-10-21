import type { ReactNode } from "react";
import { YNSMedia } from "@/lib/yns-media";
import { Eyebrow } from "./section-head";

/** Listing banner: a photograph under the hero scrim, title set low like the original's hero. */
export function FieldBanner({
	image,
	gridRef,
	eyebrow,
	title,
	lead,
	children,
}: {
	image: string | null;
	gridRef: string;
	eyebrow: string;
	title: ReactNode;
	lead?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<section className="section-x relative flex min-h-[clamp(340px,52vh,560px)] items-end overflow-hidden pt-24 pb-[clamp(40px,7vh,72px)]">
			<div className="absolute inset-0 z-0 bg-panel">
				{image ? (
					<YNSMedia
						src={image}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="100vw"
						className="object-cover brightness-[.62] saturate-[.8]"
					/>
				) : (
					<YNSMedia
						src="/images/pexels/banner-night-road.jpg"
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="100vw"
						className="object-cover brightness-[.7] saturate-[.85]"
					/>
				)}
				<div aria-hidden="true" className="hero-scrim absolute inset-0" />
				<span aria-hidden="true" className="hatch absolute right-0 bottom-0 z-[1] h-2 w-[120px] opacity-50" />
			</div>
			<div className="frame relative z-[2]">
				<Eyebrow gridRef={gridRef} label={eyebrow} className="mb-[1.4rem]" />
				<h1 className="title-hero text-ink [overflow-wrap:anywhere] [text-shadow:0_2px_40px_rgba(10,13,12,.6)]">
					{title}
				</h1>
				{lead && <p className="lead mt-6 text-ink/85">{lead}</p>}
				{children}
			</div>
		</section>
	);
}
