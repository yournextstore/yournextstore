"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type HeroCarouselSlide = {
	id: string;
	title: string;
	subtitle: string;
	ctaText: string;
	ctaHref: string;
	image: string;
	imageAlt: string;
	product: { name: string; href: string; image: string | null; price: string | null };
};

/**
 * The original's homepage carousel: copy and two buttons on the left, a large product photograph
 * with a floating product card on the right; dots and arrows along the bottom. On small screens
 * the photograph fades behind centred copy.
 */
export function HeroCarousel({ slides }: { slides: HeroCarouselSlide[] }) {
	const [index, setIndex] = useState(0);
	const trackRef = useRef<HTMLDivElement>(null);
	const count = slides.length;

	const go = (next: number) => setIndex(((next % count) + count) % count);

	// Swipe on touch screens; the track itself only moves through `index`.
	const touchStart = useRef<number | null>(null);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		// Slides that are off screen must not be reachable by Tab.
		track.querySelectorAll<HTMLElement>("[data-slide]").forEach((slide, i) => {
			slide.inert = i !== index;
		});
	}, [index]);

	if (count === 0) return null;

	return (
		<section
			aria-label="Featured"
			className="relative mb-8 bg-secondary/20 sm:mb-12 lg:mb-16"
			onTouchStart={(e) => {
				touchStart.current = e.touches[0]?.clientX ?? null;
			}}
			onTouchEnd={(e) => {
				const start = touchStart.current;
				const end = e.changedTouches[0]?.clientX;
				touchStart.current = null;
				if (start === null || end === undefined || Math.abs(end - start) < 40) return;
				go(end < start ? index + 1 : index - 1);
			}}
		>
			<div className="overflow-hidden">
				<div
					ref={trackRef}
					className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
					style={{ transform: `translateX(-${index * 100}%)` }}
				>
					{slides.map((slide, i) => (
						<div key={slide.id} data-slide className="relative min-w-full flex-[0_0_100%]">
							<div className="mx-auto max-w-shop">
								<div className="relative isolate flex min-h-[500px] flex-col justify-center px-4 py-12 sm:min-h-[550px] sm:py-16 lg:grid lg:min-h-0 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-16 xl:gap-16">
									<div className="absolute inset-0 -z-10 lg:hidden">
										<YNSMedia
											src={slide.image}
											alt=""
											fill
											sizes="100vw"
											priority={i === 0}
											className="object-cover object-center opacity-25"
										/>
										<div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/75 to-background/90" />
									</div>

									<div className="relative flex flex-col justify-center space-y-6 text-center lg:px-4 lg:text-left">
										<div className="space-y-4">
											<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
												{slide.title}
											</h2>
											<p className="mx-auto max-w-md text-base text-balance text-muted-foreground sm:text-lg lg:mx-0 lg:text-xl">
												{slide.subtitle}
											</p>
										</div>
										<div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
											<Link
												href={slide.ctaHref}
												className="inline-flex h-10 w-full items-center justify-center rounded-md bg-ink px-4 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-ink-hover sm:w-auto lg:h-12 lg:px-8 lg:text-lg"
											>
												{slide.ctaText}
											</Link>
											<Link
												href="/products"
												className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-accent sm:w-auto lg:h-12 lg:px-8 lg:text-lg"
											>
												Browse All Products
											</Link>
										</div>
									</div>

									<div className="relative hidden lg:block lg:px-4">
										<div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-white xl:h-[600px]">
											<YNSMedia
												src={slide.image}
												alt={slide.imageAlt}
												fill
												sizes="(min-width: 1280px) 600px, 50vw"
												priority={i === 0}
												className="object-cover"
											/>
											<Link
												href={slide.product.href}
												className="group absolute right-8 bottom-8 flex w-[240px] flex-col overflow-hidden rounded-lg border border-border bg-background/95 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
											>
												<span className="relative block aspect-square overflow-hidden bg-secondary/40">
													{slide.product.image && (
														<YNSMedia
															src={slide.product.image}
															alt=""
															fill
															sizes="240px"
															className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
														/>
													)}
												</span>
												<span className="flex flex-1 flex-col p-4">
													<span className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
														{slide.product.name}
													</span>
													{slide.product.price && (
														<span className="mt-auto flex items-baseline justify-between">
															<span className="text-xs text-muted-foreground">From</span>
															<span className="text-base font-bold text-primary">{slide.product.price}</span>
														</span>
													)}
												</span>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{count > 1 && (
				<>
					<div className="absolute inset-x-0 bottom-8 hidden lg:block">
						<div className="mx-auto flex max-w-shop items-center justify-between px-4">
							<div className="flex gap-2">
								{slides.map((slide, i) => (
									<button
										key={slide.id}
										type="button"
										onClick={() => go(i)}
										aria-label={`Go to slide ${i + 1}`}
										aria-current={i === index}
										className={cn(
											"h-2 rounded-full transition-all duration-300",
											i === index ? "w-8 bg-foreground" : "w-2 bg-foreground/30 hover:bg-foreground/50",
										)}
									/>
								))}
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => go(index - 1)}
									aria-label="Previous slide"
									className="flex size-10 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-all hover:scale-110 hover:bg-background hover:shadow-md"
								>
									<svg
										aria-hidden="true"
										className="size-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								<button
									type="button"
									onClick={() => go(index + 1)}
									aria-label="Next slide"
									className="flex size-10 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-all hover:scale-110 hover:bg-background hover:shadow-md"
								>
									<svg
										aria-hidden="true"
										className="size-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<div className="absolute inset-x-0 bottom-3 flex justify-center lg:hidden">
						{slides.map((slide, i) => (
							<button
								key={slide.id}
								type="button"
								onClick={() => go(i)}
								aria-label={`Go to slide ${i + 1}`}
								aria-current={i === index}
								className="flex h-6 min-w-6 items-center justify-center px-1"
							>
								<span
									className={cn(
										"block h-2.5 rounded-full transition-all duration-300",
										i === index ? "w-8 bg-foreground" : "w-2.5 bg-foreground/40",
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
