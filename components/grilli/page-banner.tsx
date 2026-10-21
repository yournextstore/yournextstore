import Image from "next/image";
import type { ReactNode } from "react";
import { isBundled } from "@/lib/editorial";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The top of every inner page, in the hero's language: a dark band (the page's photograph behind a
 * heavy veil when it has one) with the kicker, its ornament and a Forum title. It carries
 * `data-hero`, so the header floats over it transparent, as on the home page.
 */
export function PageBanner({
	kicker,
	title,
	text,
	image,
	children,
	className,
}: {
	kicker: string;
	title: string;
	text?: string | null;
	image?: string | null;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<section
			data-hero
			className={cn(
				"relative isolate overflow-hidden bg-smoky pt-[calc(var(--header-offset)+40px)] pb-[70px] text-center lg:pb-[90px]",
				className,
			)}
		>
			<div aria-hidden="true" className="absolute inset-0 -z-10">
				{image && isBundled(image) ? (
					<Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
				) : image ? (
					<YNSMedia src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
				) : (
					<div className="absolute inset-0 bg-[url('/images/form-pattern.png')] opacity-60" />
				)}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(14_13_11/0.55),rgb(14_13_11/0.92)_75%)]" />
			</div>
			<div className="container-g">
				<p className="section-subtitle">{kicker}</p>
				<h1 className="font-display text-headline-1 text-white">{title}</h1>
				{text && <p className="mx-auto mt-4 max-w-[560px] text-body-4 text-white/85">{text}</p>}
				{children}
			</div>
		</section>
	);
}
