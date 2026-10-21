"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { HeroSlide } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's banner slider (Swiper with pill bullets) as a native scroll-snap track: phones
 * swipe it, the bullets scroll it, and nothing moves layout while it loads.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);

	const onScroll = () => {
		const track = trackRef.current;
		if (!track) return;
		setActive(Math.round(track.scrollLeft / track.clientWidth));
	};

	const goTo = (index: number) => {
		const track = trackRef.current;
		track?.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
	};

	return (
		<div className="relative">
			<div
				ref={trackRef}
				onScroll={onScroll}
				className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{slides.map((slide, index) => (
					<div key={slide.href + slide.title} className="w-full shrink-0 snap-start" inert={index !== active}>
						<div className="flex flex-col items-center px-7 lg:flex-row xl:px-16">
							<div className="order-2 w-full py-10 text-center lg:order-none lg:w-1/2 lg:py-0">
								{slide.kicker ? (
									<p className="mb-2 font-medium text-soft-text md:text-xl lg:mb-3">{slide.kicker}</p>
								) : null}
								<h2 className="cp-h1 mx-auto mb-4 w-10/12 sm:w-8/12 lg:mb-10 lg:w-full">{slide.title}</h2>
								<Link href={slide.href} className="cp-btn cp-btn-sm md:cp-btn-lg">
									Shop Now
								</Link>
							</div>
							<div className="w-full lg:w-1/2">
								<div
									className={cn(
										"relative mx-auto aspect-[507/385] w-full max-w-[388px] lg:max-w-none",
										slide.kind === "scene"
											? "overflow-hidden rounded-md"
											: "mix-blend-multiply dark:mix-blend-normal",
									)}
								>
									<YNSMedia
										src={slide.image}
										alt=""
										fill
										sizes="(max-width: 1024px) 388px, 600px"
										priority={index === 0}
										className={cn(
											slide.kind === "scene"
												? "object-cover"
												: "cp-cutout object-contain [mask-image:radial-gradient(closest-side,#000_70%,transparent)]",
										)}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			{slides.length > 1 ? (
				<div className="mt-6 flex items-center justify-center lg:mt-9">
					{slides.map((slide, index) => (
						<button
							key={slide.href + slide.title}
							type="button"
							onClick={() => goTo(index)}
							aria-label={`Show slide ${index + 1}`}
							aria-current={index === active}
							className="flex size-6 items-center justify-center"
						>
							<span
								className={cn(
									"block h-2.5 rounded-full transition-all duration-200",
									index === active ? "w-5 bg-ink" : "w-2.5 bg-input",
								)}
							/>
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
