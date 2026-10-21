import Image from "next/image";
import Link from "next/link";
import { EDITORIAL } from "@/lib/editorial";

/**
 * Fluid's image banner: a full-bleed photograph with a large rounded display headline and one
 * dark button, left-aligned on the container. The still life sits on a seamless sand wall, so the
 * picture is anchored right and dissolved into a sand field behind the copy.
 */
export function Hero() {
	const image = EDITORIAL.hero;

	return (
		<section className="relative isolate h-[37.5rem] overflow-hidden bg-[#e2d8c9]">
			{image && (
				<div className="absolute inset-0 -z-10 md:left-auto md:w-[62%] md:[mask-image:linear-gradient(to_right,transparent,black_28%)]">
					<Image
						src={image.src}
						alt={image.alt}
						fill
						priority
						sizes="(max-width: 768px) 100vw, 62vw"
						className="object-cover object-[78%_60%]"
					/>
				</div>
			)}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 -z-10 h-3/5 bg-linear-to-b from-[#e2d8c9] via-[#e2d8c9]/80 to-transparent md:hidden"
			/>
			<div className="container flex h-full flex-col justify-start pt-12 md:justify-center md:pt-0">
				<div className="max-w-[34rem] lg:max-w-[42rem]">
					<h1 className="text-[2.75rem] leading-[1.12] text-balance sm:text-hero lg:text-[3.9rem] lg:leading-[1.15]">
						Embrace the warmth of slow, simple days
					</h1>
					<Link
						href="/products"
						className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Shop now
					</Link>
				</div>
			</div>
		</section>
	);
}
