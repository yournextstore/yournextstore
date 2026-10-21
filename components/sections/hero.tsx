import Image from "next/image";
import Link from "next/link";

/**
 * The original's full-bleed fading slideshow: a Playfair headline with a soft text shadow, an
 * uppercase line under it and an outlined "Shop now", all in white over the photograph. The
 * header sits transparent over it ([data-hero]).
 */
export function Hero() {
	return (
		<section
			data-hero
			className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden"
		>
			<Image
				src="/images/pexels/hero-hat-sky.jpg"
				alt=""
				fill
				priority
				sizes="100vw"
				className="-z-10 bg-[#a9cfe0] object-cover object-[50%_40%]"
			/>
			<Image
				src="/images/pexels/hero-bag-sand.jpg"
				alt=""
				fill
				sizes="100vw"
				className="hero-slide-2 -z-10 object-cover object-[50%_50%]"
			/>
			<div className="flex flex-col items-center px-6 py-24 text-white">
				<h1 className="hero-shadow mb-6 max-w-5xl text-center font-serif text-[2.75rem] leading-[1.1] sm:text-display-5">
					The care your skin has been asking for
				</h1>
				<p className="hero-shadow mb-12 text-center text-title uppercase">Gentle skincare for every day</p>
				<Link
					href="/products"
					className="hero-shadow flex h-14 items-center border border-white px-12 text-body text-white transition-colors hover:bg-white/25"
				>
					Shop now
				</Link>
			</div>
		</section>
	);
}
