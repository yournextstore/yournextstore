import { YNSMedia } from "@/lib/yns-media";

/**
 * Fluid's collection banner: a full-bleed photograph under a dimming veil with the title centred
 * in cream. Without an image it falls back to a plain left-aligned page title.
 */
export function ListingBanner({
	title,
	image,
	lede,
}: {
	title: string;
	image?: string | null;
	lede?: string;
}) {
	if (!image) {
		return (
			<div className="container pt-12 sm:pt-20">
				<h1 className="text-title sm:text-[3.125rem]">{title}</h1>
				{lede && <p className="mt-3 max-w-2xl text-body text-muted-foreground">{lede}</p>}
			</div>
		);
	}

	return (
		<section className="relative isolate flex h-60 items-center justify-center overflow-hidden bg-[#e2d8c9] sm:h-96">
			<YNSMedia
				src={image}
				alt=""
				fill
				priority
				sizes="100vw"
				className="-z-10 object-cover object-[50%_65%]"
			/>
			<div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#2b221e]/45" />
			<div className="container text-center text-cream">
				<h1 className="text-title text-balance sm:text-[3.125rem]">{title}</h1>
				{lede && <p className="mx-auto mt-3 hidden max-w-xl text-body sm:block">{lede}</p>}
			</div>
		</section>
	);
}
