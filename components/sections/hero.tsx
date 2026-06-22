"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { YnsLink } from "@/components/yns-link";
import { isVideoUrl } from "@/lib/utils";

const SLIDES = [
	{
		src: "/hero-generated-1.png",
		alt: "Minimalist living room with cream linen sofa and pampas grass",
		eyebrow: "Living Collection",
		headline: "Furniture shaped\nfor slower rooms",
		subtitle: "A quieter edit of seating, tables, and accents selected to bring warmth without clutter.",
		cta: { label: "Shop living", href: "/collection/living" },
		ctaSecondary: { label: "Browse all pieces", href: "/products" },
	},
	{
		src: "/hero-generated-2.png",
		alt: "Elegant dining room with walnut table and brass pendant lighting",
		eyebrow: "Dining Notes",
		headline: "Softer lines.\nStronger silhouettes.",
		subtitle:
			"Material-led tables, lighting, and objects for spaces that feel composed from morning through late dinner.",
		cta: { label: "Shop dining", href: "/collection/dining" },
		ctaSecondary: { label: "View the edit", href: "/products" },
	},
	{
		src: "/hero-generated-3.png",
		alt: "Serene bedroom with oak bed frame and white linen bedding",
		eyebrow: "Bedroom Edit",
		headline: "Oak, linen,\nand a steadier pace",
		subtitle:
			"Pieces chosen for rest: lower contrast, better texture, and enough character to stay interesting for years.",
		cta: { label: "Shop bedroom", href: "/collection/bedroom" },
		ctaSecondary: { label: "Explore materials", href: "/products" },
	},
] as const;

const SLIDE_DURATION = 7000;
const CYCLE_DURATION = SLIDES.length * SLIDE_DURATION;
const KEN_BURNS = ["ken-burns-1", "ken-burns-2", "ken-burns-3"] as const;

export function Hero() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const startTimer = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
		if (reducedMotion) return;
		timerRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % SLIDES.length);
		}, SLIDE_DURATION);
	}, [reducedMotion]);

	useEffect(() => {
		startTimer();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [startTimer]);

	const goToSlide = useCallback(
		(index: number) => {
			setActiveIndex(index);
			startTimer();
		},
		[startTimer],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				goToSlide((activeIndex - 1 + SLIDES.length) % SLIDES.length);
			} else if (e.key === "ArrowRight") {
				goToSlide((activeIndex + 1) % SLIDES.length);
			}
		},
		[activeIndex, goToSlide],
	);

	const slide = SLIDES[activeIndex];

	return (
		<section className="pt-4 sm:pt-6">
			<div className="page-shell">
				<div
					className="relative min-h-[68svh] overflow-hidden border border-border/80 bg-secondary sm:min-h-[74svh] lg:min-h-[80svh]"
					role="region"
					aria-roledescription="slideshow"
					aria-label="Featured collections"
					onKeyDown={handleKeyDown}
					tabIndex={0}
				>
					{SLIDES.map((s, i) => {
						const isActive = i === activeIndex;
						const isVideo = isVideoUrl(s.src);

						return (
							<div
								key={s.src}
								className="hero-slide absolute inset-0 transition-opacity duration-1000 ease-in-out"
								style={{ opacity: isActive ? 1 : 0 }}
								aria-hidden={!isActive}
							>
								{isVideo ? (
									<video
										src={s.src}
										muted
										loop
										autoPlay
										playsInline
										className="absolute inset-0 h-full w-full object-cover"
										poster={SLIDES[0].src}
									/>
								) : (
									<Image
										src={s.src}
										alt={s.alt}
										fill
										priority={i === 0}
										loading={i === 0 ? "eager" : "lazy"}
										className="object-cover"
										sizes="(max-width: 768px) 100vw, 90vw"
										style={
											!reducedMotion
												? {
														animation: `${KEN_BURNS[i % KEN_BURNS.length]} ${CYCLE_DURATION}ms ease-in-out infinite alternate`,
													}
												: undefined
										}
									/>
								)}
								<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,244,238,0.95)_0%,rgba(248,244,238,0.82)_34%,rgba(248,244,238,0.44)_58%,rgba(33,28,24,0.08)_100%)]" />
								<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,244,238,0.12)_0%,rgba(248,244,238,0)_42%,rgba(16,14,12,0.12)_100%)]" />
							</div>
						);
					})}

					<div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-12">
						<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
							<div
								key={activeIndex}
								className="hero-content mt-auto max-w-2xl self-end lg:self-start"
								style={
									!reducedMotion
										? { animation: "hero-content-enter 800ms cubic-bezier(0.25, 1, 0.5, 1) forwards" }
										: undefined
								}
							>
								<p className="editorial-kicker mb-4 text-foreground/70">{slide.eyebrow}</p>
								<h1 className="editorial-title whitespace-pre-line text-foreground">{slide.headline}</h1>
								<p className="mt-5 max-w-xl text-sm leading-7 text-foreground/72 sm:text-base">
									{slide.subtitle}
								</p>
								<div className="mt-8 flex flex-wrap gap-3">
									<YnsLink
										prefetch="eager"
										href={slide.cta.href}
										className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-3 text-[0.76rem] uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-foreground/92"
									>
										{slide.cta.label}
										<ArrowRight className="h-3.5 w-3.5" />
									</YnsLink>
									<YnsLink
										prefetch="eager"
										href={slide.ctaSecondary.href}
										className="inline-flex items-center gap-2 border border-foreground/18 bg-background/72 px-5 py-3 text-[0.76rem] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-background/90"
									>
										{slide.ctaSecondary.label}
									</YnsLink>
								</div>
							</div>

							<div className="hidden justify-self-end border border-foreground/10 bg-background/72 p-5 text-sm text-foreground/68 backdrop-blur lg:block">
								<p className="editorial-kicker mb-3 text-foreground/48">A quieter approach</p>
								<p className="leading-7">
									We&apos;re pairing stronger silhouettes with softer finishes so the room feels more
									collected than styled.
								</p>
							</div>
						</div>

						<div className="mt-10 flex flex-col gap-6 border-t border-foreground/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
							<div className="grid gap-4 text-[0.72rem] uppercase tracking-[0.18em] text-foreground/55 sm:grid-cols-3 sm:gap-8">
								<span>Natural materials</span>
								<span>Independent studios</span>
								<span>Delivery across the U.S.</span>
							</div>
							<div className="flex items-center gap-2.5 self-start sm:self-auto">
								{SLIDES.map((_, i) => (
									<button
										key={`indicator-${SLIDES[i].src}`}
										type="button"
										onClick={() => goToSlide(i)}
										className={`h-[2px] transition-all duration-500 ${
											i === activeIndex ? "w-10 bg-foreground" : "w-5 bg-foreground/25 hover:bg-foreground/45"
										}`}
										aria-label={`Go to slide ${i + 1}`}
										aria-current={i === activeIndex ? "true" : undefined}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
