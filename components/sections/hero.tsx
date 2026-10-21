import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { getHeroSlides } from "@/lib/catalog";

export async function Hero() {
	const slides = await getHeroSlides();
	if (slides.length === 0) return null;

	return (
		<HeroCarousel
			slides={slides.map((slide, index) => ({
				id: slide.id,
				node: (
					<div className="relative aspect-[1.9/3] w-full bg-hero md:aspect-[16/7]">
						<Image
							src={slide.image}
							alt=""
							fill
							sizes="100vw"
							priority={index === 0}
							className="object-cover object-[92%_50%] md:object-[center_35%]"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-hero/90 via-hero/60 to-transparent md:block"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-hero via-hero/85 to-transparent md:hidden"
						/>
						<div className="absolute inset-0 flex flex-col items-center justify-end gap-5 px-4 pb-16 md:mx-16 md:items-start md:justify-center md:px-0 md:pb-0">
							<p className="max-w-3xl text-center font-extrabold text-5xl text-bar uppercase leading-none wrap-break-word md:text-left md:text-7xl">
								{slide.title}
							</p>
							<Link
								href={slide.href}
								aria-label={`Shop now: ${slide.title}`}
								className="btn-sun rounded px-4 py-2 uppercase"
							>
								Shop now
							</Link>
						</div>
					</div>
				),
			}))}
		/>
	);
}
