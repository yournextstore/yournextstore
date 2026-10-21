import type { ReactNode } from "react";
import { YNSMedia } from "@/lib/yns-media";
import { Eyebrow } from "./section-head";

/**
 * Listing/about banner in the hero's language: a photograph under the three-layer scrim, title set
 * low. Catalogue packshots (pale studio backdrops) sit as a dimmed print on the right instead of
 * being blown up behind the type.
 */
export function PageBanner({
	image,
	packshot = false,
	eyebrow,
	title,
	lead,
	children,
}: {
	image: string | null;
	/** The image is a catalogue packshot rather than a photograph. */
	packshot?: boolean;
	eyebrow: string;
	title: ReactNode;
	lead?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<section
			data-hero
			className="section-x relative isolate flex min-h-[clamp(380px,56vh,580px)] items-end overflow-hidden pt-28 pb-[clamp(40px,7vh,72px)]"
		>
			<div className="absolute inset-0 -z-[1] bg-page">
				{image && packshot ? (
					<div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
						<YNSMedia
							src={image}
							alt=""
							fill
							priority
							fetchPriority="high"
							sizes="(max-width: 768px) 100vw, 60vw"
							className="object-cover brightness-[.62] sepia-[.2] [mask-image:linear-gradient(to_right,transparent,black_40%)]"
						/>
					</div>
				) : (
					<YNSMedia
						src={image ?? "/images/pexels/copper-spiral.jpg"}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="100vw"
						className="object-cover"
					/>
				)}
				<div aria-hidden="true" className="hero-scrim absolute inset-0" />
			</div>
			<div className="frame relative">
				<Eyebrow label={eyebrow} className="mb-[1.4rem]" />
				<h1 className="title-hero max-w-[16ch] text-ink [overflow-wrap:anywhere]">{title}</h1>
				{lead && <p className="lead mt-6">{lead}</p>}
				{children}
			</div>
		</section>
	);
}
