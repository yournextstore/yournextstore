import { ArtPhoto } from "@/components/art-photo";

const hero = { src: "/images/pexels/hero.jpg", width: 2000, height: 1335 };
const heroMobile = { src: "/images/pexels/hero-mobile.jpg", width: 900, height: 1600 };

/**
 * The first screen: the photograph across the whole screen, darkened on the left behind the
 * headline. `data-hero` turns the header white over it (see globals.css).
 */
export function Hero({ headline }: { headline: string }) {
	return (
		<section data-hero className="relative h-svh min-h-[30rem] overflow-hidden text-white">
			<ArtPhoto wide={hero} tall={heroMobile} alt="" priority />
			<div className="absolute inset-0 bg-linear-to-l from-transparent from-[34.5%] to-black/30 to-[62.7%] lg:from-[70.5%] lg:to-[83%]" />
			<h1 className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-title lg:max-w-[50%]">{headline}</h1>
		</section>
	);
}
