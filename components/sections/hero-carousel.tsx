"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import slideEyewear from "@/public/images/pexels/slide-eyewear.jpg";
import slideHandbag from "@/public/images/pexels/slide-handbag-heel.jpg";
import slideStillLife from "@/public/images/pexels/slide-still-life.jpg";
import slideVase from "@/public/images/pexels/slide-vase-chair.jpg";

const slides = [slideHandbag, slideEyewear, slideStillLife, slideVase];

const DELAY = 4000;

/**
 * The original's autoplaying, rounded hero carousel (embla + autoplay, paused on hover). Slides
 * move with a transform only, so the layout never shifts; reduced-motion visitors start paused.
 */
export function HeroCarousel() {
	const [active, setActive] = useState(0);
	const [hovered, setHovered] = useState(false);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
	}, []);

	useEffect(() => {
		if (paused || hovered || count < 2) return;
		const id = window.setInterval(() => setActive((index) => (index + 1) % count), DELAY);
		return () => window.clearInterval(id);
	}, [paused, hovered]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative w-full overflow-hidden rounded-lg"
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocusCapture={() => setHovered(true)}
			onBlurCapture={() => setHovered(false)}
		>
			<div
				className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
				style={{ transform: `translateX(-${active * 100}%)` }}
			>
				{slides.map((slide, slideIndex) => (
					<div
						key={slide.src}
						inert={slideIndex !== active}
						className="relative aspect-[4/5] min-w-0 flex-[0_0_100%] bg-secondary sm:aspect-video"
					>
						<Image
							src={slide}
							alt=""
							fill
							placeholder="blur"
							sizes="(min-width: 1280px) 1280px, 100vw"
							className="object-cover"
							priority={slideIndex === 0}
						/>
					</div>
				))}
			</div>

			{count > 1 ? (
				<div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-background px-1.5 py-1 shadow-sm">
					{slides.map((_, index) => (
						<button
							key={`dot-${slides[index]?.src}`}
							type="button"
							onClick={() => setActive(index)}
							aria-label={`Show slide ${index + 1}`}
							aria-current={index === active}
							className="flex size-6 items-center justify-center rounded-full"
						>
							<span
								className={cn(
									"block h-1.5 rounded-full bg-foreground/25 transition-all",
									index === active ? "w-4 bg-foreground" : "w-1.5",
								)}
							/>
						</button>
					))}
					<button
						type="button"
						onClick={() => setPaused((value) => !value)}
						aria-label={paused ? "Play slideshow" : "Pause slideshow"}
						className="flex size-6 items-center justify-center rounded-full hover:bg-accent"
					>
						{paused ? (
							<Play aria-hidden="true" className="size-3" />
						) : (
							<Pause aria-hidden="true" className="size-3" />
						)}
					</button>
				</div>
			) : null}
		</section>
	);
}
