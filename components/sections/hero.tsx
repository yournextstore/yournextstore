import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/pexels/hero-beige-chair.jpg";

/**
 * The original's 800px banner: one campaign photograph under a dark wash, the headline and
 * two square buttons at the bottom centre.
 */
export function Hero() {
	return (
		<section className="relative flex h-[800px] w-full flex-col items-center justify-end overflow-hidden bg-[#2b2925] max-sm:h-[550px]">
			<Image
				src={heroImage}
				alt=""
				fill
				priority
				placeholder="blur"
				sizes="100vw"
				className="object-cover object-[50%_25%]"
			/>
			<div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.1)_100%)]" />
			<div className="relative flex flex-col items-center px-5 max-sm:gap-2">
				<h1 className="text-center text-6xl font-bold leading-[60px] tracking-[1.86px] text-white max-sm:text-4xl max-sm:leading-tight max-[400px]:text-3xl">
					Discover Our <br />
					Latest Collection
				</h1>
				<p className="text-center text-3xl leading-[72px] tracking-[0.9px] text-white max-sm:text-xl max-sm:leading-normal max-[400px]:text-lg">
					Pieces Chosen with Care
				</p>
				<div className="flex w-[420px] items-center justify-center gap-3 pb-10 max-sm:w-[350px] max-[400px]:w-[280px] max-[400px]:flex-col max-[400px]:gap-1">
					<Link href="/products" className="btn-white text-xl max-md:text-lg">
						Shop Now
					</Link>
					<Link href="#our-collection" className="btn-ghost-white text-xl max-md:text-lg">
						See Collection
					</Link>
				</div>
			</div>
		</section>
	);
}
