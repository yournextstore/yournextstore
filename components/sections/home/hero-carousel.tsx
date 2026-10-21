"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { splitWordmark } from "@/lib/display";
import { cn } from "@/lib/utils";

export type HeroSlide = {
	key: string;
	title: string;
	script: [string, string];
	href: string;
	cta: string;
	image: string | null;
};

const SLIDE_MS = 8000;

function SlideTitle({ title, first }: { title: string; first: boolean }) {
	const { head, tail } = splitWordmark(title.toUpperCase());
	const Tag = first ? "h1" : "p";
	// Size the poster word by its length so long collection names still fit the stage.
	const len = Math.max(4, title.length);
	return (
		<Tag
			className="hero-word font-anton leading-[0.86] tracking-[-0.01em] text-hero [text-shadow:0.045em_0.045em_0_#4c63d8]"
			style={{ "--len": len } as React.CSSProperties}
		>
			<span className="sr-only">{title}</span>
			<span aria-hidden="true" className="relative inline-block">
				{head}
				<span className="text-alert [text-shadow:0.045em_0.045em_0_#7a0006] lg:absolute lg:top-0 lg:left-full">
					{tail}
				</span>
			</span>
		</Tag>
	);
}

/** The original's full-bleed fading slider: photo, navy side panel, poster wordmark, script tagline, pill CTA. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
	const [active, setActive] = useState(0);
	const count = slides.length;

	useEffect(() => {
		if (count < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => setActive((i) => (i + 1) % count), SLIDE_MS);
		return () => window.clearInterval(id);
	}, [count]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative h-[34.5rem] overflow-hidden bg-hero lg:h-[clamp(34rem,calc(100svh-7rem),49.25rem)]"
		>
			{slides.map((slide, index) => {
				const current = index === active;
				return (
					<div
						key={slide.key}
						aria-hidden={!current}
						inert={!current}
						className={cn(
							"absolute inset-0 transition-opacity duration-1000 ease-out",
							current ? "z-10 opacity-100" : "z-0 opacity-0",
						)}
					>
						{/* Photo: full bleed on phones, the left ~77% on desktop with the navy panel beside it. */}
						<div className="absolute inset-0 lg:right-[23%]">
							{slide.image && (
								<Image
									src={slide.image}
									alt=""
									fill
									sizes="(max-width: 1024px) 100vw, 77vw"
									priority={index === 0}
									className="object-cover"
								/>
							)}
							<div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(23_32_59/0.15)_0%,rgb(23_32_59/0.35)_55%,rgb(2_62_138/0.92)_100%)] lg:bg-[linear-gradient(90deg,rgb(23_32_59/0.08)_0%,rgb(23_32_59/0.28)_60%,rgb(23_32_59/0.55)_100%)]" />
						</div>
						<div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[23%] bg-hero lg:block" />
						{/* Decorative dot and plus grids from the original's panel. */}
						<div
							aria-hidden="true"
							className="dot-grid absolute top-[13%] left-[3%] h-14 w-14 opacity-70 lg:left-auto lg:right-[22%] lg:top-[4%] lg:h-20 lg:w-24"
						/>
						<div
							aria-hidden="true"
							className="dot-grid absolute top-[14%] right-[3%] h-10 w-10 opacity-60 lg:top-[13%] lg:right-[2%] lg:h-9 lg:w-9"
						/>
						<div
							aria-hidden="true"
							className="dot-grid absolute right-[2%] bottom-[24%] hidden h-20 w-24 opacity-70 lg:block"
						/>

						<div className="absolute inset-x-0 top-[34%] px-6 text-center lg:inset-x-auto lg:top-[37%] lg:right-[23%] lg:px-0 lg:text-right">
							<SlideTitle title={slide.title} first={index === 0} />
							<p className="mt-2 -rotate-3 font-script text-[1.875rem] leading-[1.15] text-[#e6efff] [text-shadow:0_2px_12px_rgb(4_20_50/0.55)] lg:-mt-6 lg:mr-[-12%] lg:text-[2.75rem] lg:leading-[1.05]">
								<span className="block lg:-translate-x-[42%]">{slide.script[0]}</span>
								<span className="block">{slide.script[1]}</span>
							</p>
						</div>

						<Link
							href={slide.href}
							className="absolute right-8 bottom-[22%] flex min-h-12 min-w-40 animate-fade-slide-up items-center justify-center rounded-full border border-page px-6 text-sm font-bold tracking-wider text-page uppercase transition hover:scale-105 hover:shadow-[0_0_30px_rgb(2_62_138/0.6)] sm:right-14 md:min-h-[3.9rem] md:min-w-[13.25rem] md:text-lg lg:right-[6%] lg:bottom-[12%] lg:border-none lg:bg-main"
						>
							{slide.cta}
							<span className="sr-only">: {slide.title}</span>
						</Link>
					</div>
				);
			})}

			{count > 1 && (
				<div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-1 lg:bottom-6 lg:pr-[23%]">
					{slides.map((slide, index) => (
						<button
							key={slide.key}
							type="button"
							aria-label={`Show slide ${index + 1}`}
							aria-current={index === active}
							onClick={() => setActive(index)}
							className="flex h-7 w-7 cursor-pointer items-center justify-center"
						>
							<span
								className={cn(
									"block h-4 w-4 rounded-full bg-white transition",
									index === active && "ring-2 ring-white ring-offset-2 ring-offset-hero bg-hero",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
