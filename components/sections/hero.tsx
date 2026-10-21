import Image from "next/image";
import type { ReactNode } from "react";
import { PillLink } from "@/components/pill-link";
import { cn } from "@/lib/utils";

/**
 * The original's Hero: a dark, warm photograph, full bleed, with centred white type and one
 * white pill. `underHeader` pulls it up beneath the translucent sticky header, as on the home page.
 */
export function PhotoHero({
	children,
	action,
	className,
	underHeader = false,
	priority = false,
}: {
	children: ReactNode;
	action?: { href: string; label: string };
	className?: string;
	underHeader?: boolean;
	priority?: boolean;
}) {
	return (
		<section
			className={cn(
				"relative isolate flex flex-col items-center justify-center overflow-hidden bg-moss text-white",
				underHeader && "-mt-(--header-height) pt-(--header-height)",
				className,
			)}
		>
			<Image
				src="/images/pexels/hero-bags.jpg"
				alt=""
				fill
				priority={priority}
				sizes="100vw"
				className="-z-20 object-cover"
			/>
			<div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />
			<div className="page-container text-center">
				{children}
				{action && (
					<PillLink href={action.href} className="mt-8 lg:mt-10">
						{action.label}
					</PillLink>
				)}
			</div>
		</section>
	);
}

export function Hero({ storeName }: { storeName: string }) {
	return (
		<PhotoHero
			underHeader
			priority
			className="min-h-[38rem] md:min-h-[50rem]"
			action={{ href: "/products", label: "Discover Our Coffees" }}
		>
			<div className="space-y-7 md:space-y-9">
				<p className="font-display text-xl uppercase md:text-display-sm">Coffee &amp; Community</p>
				<h1 className="font-wordmark text-[clamp(1.625rem,7vw,6rem)] leading-none break-words uppercase">
					{storeName}
				</h1>
				<p className="mx-auto max-w-prose text-base text-pretty md:text-lg">
					Discover small-batch coffee, roasted with care. At {storeName}, we keep a short list of single
					origins and blends worth&nbsp;brewing&nbsp;every&nbsp;day.
				</p>
			</div>
		</PhotoHero>
	);
}
