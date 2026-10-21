import { getHeroData } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";
import { HeroHeadline } from "./hero-headline";

export async function Hero() {
	const { headline, image } = await getHeroData();

	return (
		// data-hero: the header sits transparent and white over this section (globals.css).
		<section data-hero className="relative h-[50svh] min-h-80 overflow-hidden bg-[#c8ced3] lg:h-[80svh]">
			<YNSMedia src={image} alt="" fill sizes="100vw" priority className="object-cover object-[60%_top]" />
			{/* The original sets white type straight on a studio photograph; a soft shade keeps the
			    header and the word legible on the pale backdrop. */}
			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent via-25% to-black/35"
			/>
			<div className="pointer-events-none absolute inset-x-0 bottom-0">
				<HeroHeadline>{headline}</HeroHeadline>
			</div>
		</section>
	);
}
