"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type Slide = {
	href: string;
	image: string;
	label: string;
	kicker: string;
	title: string;
	text: string | null;
};

/** UIkit slideshow with dot navigation; the photograph sits right, a caption with one button left. */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (media.matches) return;
		const timer = window.setInterval(() => setActive((index) => (index + 1) % count), 7000);
		return () => window.clearInterval(timer);
	}, [count, paused]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative overflow-hidden bg-[#f8f7f5]"
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div className="relative grid lg:h-[600px]">
				{slides.map((slide, index) => (
					<div
						key={slide.href + slide.image}
						aria-hidden={index !== active}
						className={cn(
							"col-start-1 row-start-1 transition-opacity duration-700 lg:h-full",
							index === active ? "opacity-100" : "pointer-events-none invisible opacity-0",
						)}
					>
						<div className="relative aspect-[3/2] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[62.5%]">
							<YNSMedia
								src={slide.image}
								alt=""
								fill
								sizes="(max-width: 1024px) 100vw, 62vw"
								priority={index === 0}
								className="object-cover"
							/>
						</div>
						<div className="uk-container relative flex justify-center pt-[15px] pb-[50px] lg:h-full lg:items-center lg:justify-start lg:pb-0">
							<div className="max-w-[440px] text-center lg:text-left">
								<p className="text-uk-sm uppercase text-muted-foreground">{slide.kicker}</p>
								<h2 className="mt-[5px] text-[2rem] leading-tight font-light text-foreground lg:text-[3.25rem]">
									{slide.title}
								</h2>
								{slide.text && <p className="mt-[15px] text-uk-md">{slide.text}</p>}
								<Link
									href={slide.href}
									tabIndex={index === active ? undefined : -1}
									className="uk-btn uk-btn-primary mt-[30px]"
									aria-label={`Shop now, ${slide.title}`}
								>
									Shop now
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
			{count > 1 && (
				<ul className="absolute inset-x-0 bottom-[15px] flex justify-center">
					{slides.map((slide, index) => (
						<li key={`dot-${slide.image}`}>
							<button
								type="button"
								aria-label={`Show slide ${index + 1} of ${count}`}
								aria-current={index === active}
								onClick={() => setActive(index)}
								className="flex size-6 items-center justify-center"
							>
								<span
									className={cn(
										"block size-[10px] rounded-full border border-ink/70 transition-colors",
										index === active ? "bg-ink/70" : "bg-transparent hover:bg-ink/30",
									)}
								/>
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
