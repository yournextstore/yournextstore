import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/pexels/hero-boutique-shelves.jpg";

/**
 * The original's high-impact hero: a full-bleed photograph under a dark wash, a two-line bold
 * headline, one line of copy and a small white button, centred on desktop and left-aligned on
 * phones.
 */
export function Hero() {
	return (
		<section className="relative isolate flex min-h-[30rem] items-center overflow-hidden bg-ink text-white lg:min-h-[80vh]">
			<div aria-hidden className="absolute inset-0 -z-10">
				<Image
					src={heroImage}
					alt=""
					fill
					priority
					placeholder="blur"
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-black/45" />
			</div>
			<div className="shell py-16">
				<div className="mx-auto max-w-[36.5rem] md:text-center">
					<h1 className="text-[2.125rem] font-extrabold leading-[1.1] tracking-tight md:text-[3.5rem]">
						Step in the right <span className="md:block">direction</span>
					</h1>
					<p className="mt-5 text-base leading-7 text-white/90 md:mt-6">
						Discover shoes that blend style with comfort. From casual sneakers and sturdy boots to elegant
						dress shoes.
					</p>
					<Link
						href="/products"
						className="mt-6 inline-flex h-10 items-center rounded-sm bg-white px-4 text-sm font-medium text-[#111827] transition-colors hover:bg-white/90 md:mt-6 md:h-9 md:px-3"
					>
						Shop collection
					</Link>
				</div>
			</div>
		</section>
	);
}
