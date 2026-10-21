"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { HeroSlide } from "@/lib/shop";
import { cn } from "@/lib/utils";

const arrowClass =
	"absolute inset-y-0 z-10 my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white pb-1 text-3xl leading-none font-bold text-black transition-colors hover:bg-gray-900 hover:text-white";

/**
 * The original's three-slide hero: a still-life on a pale wall with a one-line title and an
 * underlined link, arrows in white discs and bullet indicators. The photo fades
 * into the wall colour on the left so the slide reads as one composition.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
	const [active, setActive] = useState(0);
	const count = slides.length;
	const go = (index: number) => setActive((index + count) % count);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative mx-auto w-full max-w-[1600px] overflow-hidden"
		>
			<div className="relative h-[50vh] min-h-[24rem] max-h-[40rem] w-full bg-stage">
				{slides.map((slide, index) => (
					<div
						key={slide.href}
						inert={index !== active}
						className={cn(
							"absolute inset-0 transition-opacity duration-[600ms] ease-out",
							index === active ? "opacity-100" : "opacity-0",
						)}
					>
						<div className="absolute inset-x-0 bottom-0 h-[62%] [mask-image:linear-gradient(to_bottom,transparent,#000_32%)] md:inset-y-0 md:left-auto md:h-full md:w-[64%] md:[mask-image:linear-gradient(to_right,transparent,#000_30%)]">
							<Image
								src={slide.image}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 64vw"
								priority={index === 0}
								className="object-cover"
							/>
						</div>
						<div className="relative container mx-auto flex h-full pt-6 md:items-center md:pt-0">
							<div className="flex w-full flex-col items-center px-14 tracking-wide md:ml-16 md:items-start md:px-6 lg:w-1/2">
								<p className="my-4 text-center text-2xl text-black md:text-left">{slide.title}</p>
								<Link href={slide.href} className="nordic-link text-xl text-gray-600">
									{slide.cta}
									<span className="sr-only">: {slide.title}</span>
								</Link>
							</div>
						</div>
					</div>
				))}

				{count > 1 && (
					<>
						<button
							type="button"
							onClick={() => go(active - 1)}
							aria-label="Previous slide"
							className={cn(arrowClass, "left-0 ml-2 md:ml-10")}
						>
							‹
						</button>
						<button
							type="button"
							onClick={() => go(active + 1)}
							aria-label="Next slide"
							className={cn(arrowClass, "right-0 mr-2 md:mr-10")}
						>
							›
						</button>
						<ol className="absolute inset-x-0 bottom-[2%] z-10 flex justify-center gap-1">
							{slides.map((slide, index) => (
								<li key={slide.href}>
									<button
										type="button"
										onClick={() => go(index)}
										aria-label={`Show slide ${index + 1}`}
										aria-current={index === active}
										className="group flex h-8 w-8 items-center justify-center"
									>
										<span
											aria-hidden
											className={cn(
												"h-2.5 w-2.5 rounded-full transition-colors",
												index === active ? "bg-black" : "bg-gray-400 group-hover:bg-gray-900",
											)}
										/>
									</button>
								</li>
							))}
						</ol>
					</>
				)}
			</div>
		</section>
	);
}
