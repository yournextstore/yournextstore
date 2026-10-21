"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeroLink = { href: string; label: string };

export type Slide = {
	title: string;
	text: string;
	primary: HeroLink;
	secondary: HeroLink;
	note: string;
	image: { src: string; alt: string };
};

/** Fades between slides every 5s, pauses on hover, stays still for reduced motion. */
export function HeroSlider({ slides }: { slides: Slide[] }) {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused || slides.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = setInterval(() => setCurrent((index) => (index + 1) % slides.length), 5000);
		return () => clearInterval(timer);
	}, [paused, slides.length]);

	return (
		<section
			aria-label="Featured"
			className="relative h-[62vh] min-h-[420px] overflow-hidden md:h-[74vh]"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{slides.map((slide, index) => {
				const Title = index === 0 ? "h1" : "p";
				const active = index === current;
				return (
					<div
						key={slide.title}
						aria-hidden={!active}
						inert={!active}
						className={cn(
							"absolute inset-0 transition-opacity duration-700",
							active ? "opacity-100" : "pointer-events-none opacity-0",
						)}
					>
						<Image
							src={slide.image.src}
							alt={slide.image.alt}
							fill
							sizes="100vw"
							priority={index === 0}
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/5" />
						<div className="absolute inset-x-0 bottom-0">
							<div className="mx-auto max-w-6xl px-5 pb-14 md:pb-16">
								<Title className="max-w-[16ch] font-display text-hero font-medium text-white">
									{slide.title}
								</Title>
								<p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/85">{slide.text}</p>
								<div className="mt-7 flex flex-wrap items-center gap-3">
									<Link
										href={slide.primary.href}
										className="bg-[#f8f5ef] px-7 py-3.5 text-[14px] font-semibold text-[#1c1613] hover:bg-white"
									>
										{slide.primary.label}
									</Link>
									<Link
										href={slide.secondary.href}
										className="border border-white/60 px-7 py-3.5 text-[14px] font-semibold text-white hover:bg-white/10"
									>
										{slide.secondary.label}
									</Link>
									<span className="ml-1 hidden text-small text-white/80 sm:inline">{slide.note}</span>
								</div>
							</div>
						</div>
					</div>
				);
			})}
			{slides.length > 1 && (
				<div className="absolute bottom-3 right-3 z-10 flex items-center md:bottom-5 md:right-6">
					{slides.map((slide, index) => (
						<button
							key={slide.title}
							type="button"
							aria-label={`Show slide ${index + 1}`}
							aria-pressed={index === current}
							onClick={() => setCurrent(index)}
							className="flex h-6 w-9 items-center justify-center"
						>
							<span
								className={cn("h-[3px] w-7 transition", index === current ? "bg-white" : "bg-white/40")}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
