"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { BannerSlide } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TONES = ["bg-pastel-1", "bg-pastel-2", "bg-pastel-3", "bg-pastel-4", "bg-pastel-5"];
const DELAY = 7000;

/** The original's pastel banners: an autoplaying loop with arrows that slide in on hover. */
export function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = setInterval(() => setActive((index) => (index + 1) % count), DELAY);
		return () => clearInterval(timer);
	}, [count, paused]);

	const go = (step: number) => setActive((index) => (index + step + count) % count);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Shop sections"
			className="group/banner relative mb-12 lg:mb-20"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div className="overflow-hidden rounded-lg">
				<div
					className="flex transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
					style={{ transform: `translateX(-${active * 100}%)` }}
				>
					{slides.map((slide, index) => (
						<div
							key={slide.href}
							aria-hidden={index !== active}
							inert={index !== active}
							className={cn(
								"grid w-full shrink-0 grid-rows-[15rem_auto] overflow-hidden sm:grid-rows-[18rem_auto] lg:h-[450px] lg:grid-cols-12 lg:grid-rows-1",
								TONES[index % TONES.length],
							)}
						>
							<div className="relative overflow-hidden lg:order-2 lg:col-span-5">
								<Image
									src={slide.image}
									alt=""
									fill
									sizes="(max-width: 1024px) 100vw, 40vw"
									priority={index === 0}
									className="object-cover"
								/>
							</div>
							<div className="flex items-center px-6 pt-2 pb-10 sm:px-10 lg:order-1 lg:col-span-7 lg:py-0 lg:pl-20">
								<div className="flex min-w-0 flex-col">
									<h2 className="mb-3 font-display text-[2.5rem] leading-[1.05] text-balance capitalize sm:text-5xl lg:mb-4 lg:text-6xl">
										{slide.title}
									</h2>
									<p className="mb-6 line-clamp-2 min-h-[3rem] max-w-md text-base text-primary lg:mb-8">
										{slide.description}
									</p>
									<Link
										href={slide.href}
										tabIndex={index === active ? undefined : -1}
										className="shimmer inline-flex h-11 w-max items-center gap-2 rounded-full bg-primary px-8 font-display text-lg font-light text-primary-foreground transition-colors hover:bg-primary/90"
									>
										Shop now
										<span className="sr-only">: {slide.title}</span>
										<ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{count > 1 && (
				<>
					<button
						type="button"
						onClick={() => go(-1)}
						aria-label="Previous slide"
						className="absolute top-1/2 left-8 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-background opacity-0 shadow-md transition-all duration-300 hover:shadow-lg focus-visible:opacity-100 group-hover/banner:-left-6 group-hover/banner:opacity-100 lg:flex"
					>
						<ChevronLeft className="size-6" strokeWidth={1.5} />
					</button>
					<button
						type="button"
						onClick={() => go(1)}
						aria-label="Next slide"
						className="absolute top-1/2 right-8 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-background opacity-0 shadow-md transition-all duration-300 hover:shadow-lg focus-visible:opacity-100 group-hover/banner:-right-6 group-hover/banner:opacity-100 lg:flex"
					>
						<ChevronRight className="size-6" strokeWidth={1.5} />
					</button>
					<div className="mt-3 flex justify-center gap-1 lg:hidden">
						{slides.map((slide, index) => (
							<button
								key={slide.href}
								type="button"
								onClick={() => setActive(index)}
								aria-label={`Show slide ${index + 1}`}
								aria-current={index === active}
								className="flex size-6 items-center justify-center"
							>
								<span
									className={cn(
										"h-1.5 rounded-full transition-all",
										index === active ? "w-5 bg-primary" : "w-1.5 bg-primary/25",
									)}
								/>
							</button>
						))}
					</div>
				</>
			)}
		</section>
	);
}
