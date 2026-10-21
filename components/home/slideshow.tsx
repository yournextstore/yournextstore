"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type Slide = { kicker: string; title: string; text: string; href: string; cta: string };

/** Full-bleed photo carousel under a navy scrim, one white card centred on top. */
export function SlideShow({ images, slides }: { images: string[]; slides: Slide[] }) {
	const [index, setIndex] = useState(0);
	const [hasInteracted, setHasInteracted] = useState(false);
	const count = Math.max(images.length, 1);

	useEffect(() => {
		if (hasInteracted || count < 2) return;
		const timer = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
		return () => clearInterval(timer);
	}, [hasInteracted, count]);

	const slide = slides[index % slides.length] ?? slides[0];
	const image = images[index];

	return (
		<section aria-roledescription="carousel" aria-label="Featured" className="mb-4">
			<div className="relative">
				<div key={index} className="relative h-[500px] w-full animate-fade-in bg-secondary">
					{image && (
						<YNSMedia src={image} alt="" fill sizes="100vw" priority={index === 0} className="object-cover" />
					)}
				</div>
				<div className="absolute inset-0 bg-scrim">
					<div className="absolute right-0 bottom-0 left-0 m-auto h-fit w-full text-center md:top-0 md:w-fit md:max-w-[calc(100%-3rem)]">
						<div className="flex flex-col gap-3 border-border bg-background px-6 py-8 sm:px-16 md:rounded-md md:border">
							<p className="font-medium uppercase tracking-wide">{slide?.kicker}</p>
							<div className="mb-2 flex flex-col gap-2">
								<p className="text-3xl font-bold">{slide?.title}</p>
								<p>{slide?.text}</p>
							</div>
							{slide && (
								<div>
									<Button asChild>
										<Link href={slide.href}>{slide.cta}</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{count > 1 && (
				<div className="mt-2 flex items-center justify-center gap-0">
					{images.map((src, i) => (
						<button
							key={src}
							type="button"
							aria-label={`Show slide ${i + 1}`}
							aria-current={index === i}
							onClick={() => {
								setIndex(i);
								setHasInteracted(true);
							}}
							className="grid h-6 w-6 place-items-center"
						>
							<span
								className={cn(
									"mt-2 h-3 w-3 rounded-full border-2 border-primary",
									index === i && "bg-primary",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
