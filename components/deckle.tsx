import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's small parts: chips, text links, buttons, a band's head, the store's seal and
 * the stage a print sits on. Shared by every page so the shop reads as one system.
 */

export type ChipTone = "neutral" | "accent" | "soft";

const chipTones: Record<ChipTone, string> = {
	neutral: "bg-secondary text-muted-foreground",
	accent: "bg-copper text-on-feature dark:text-background",
	soft: "bg-copper-wash text-copper-ink",
};

/** A short fact in a pill: a count, a price note, what is new. */
export function Chip({ tone = "neutral", className, ...rest }: ComponentProps<"span"> & { tone?: ChipTone }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold leading-normal tabular-nums",
				chipTones[tone],
				className,
			)}
			{...rest}
		/>
	);
}

/** A link that stands alone under a section, in the copper ink. */
export function TextLink({
	href,
	children,
	arrow = false,
	tone = "accent",
	className,
}: {
	href: string;
	children: ReactNode;
	arrow?: boolean;
	tone?: "accent" | "onFeature";
	className?: string;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"inline-flex items-center gap-1 text-[0.9375rem] font-semibold underline-offset-4 hover:underline",
				tone === "accent" ? "text-copper-ink" : "text-on-feature",
				className,
			)}
		>
			{children}
			{arrow && <ArrowRight aria-hidden="true" className="size-4" />}
		</Link>
	);
}

export type ButtonVariant = "primary" | "accent" | "paper";

const buttonVariants: Record<ButtonVariant, string> = {
	primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
	accent:
		"bg-copper text-on-feature hover:bg-[color-mix(in_srgb,var(--copper)_86%,var(--foreground))] dark:text-background",
	paper: "bg-background text-foreground hover:bg-secondary",
};

/** The one action a screen leads to: 56px tall, 10px corners, the label's weight. */
export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
	return cn(
		"inline-flex min-h-14 items-center justify-center gap-2 rounded-control px-8 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-secondary disabled:text-faint",
		buttonVariants[variant],
		className,
	);
}

export function ButtonLink({
	href,
	children,
	variant = "primary",
	icon,
	className,
}: {
	href: string;
	children: ReactNode;
	variant?: ButtonVariant;
	icon?: ReactNode;
	className?: string;
}) {
	return (
		<Link href={href} className={buttonClass(variant, className)}>
			{icon}
			{children}
		</Link>
	);
}

/** A band's title, with a link to more beside it. */
export function SectionHead({ id, title, action }: { id: string; title: ReactNode; action?: ReactNode }) {
	return (
		<div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
			<h2 id={id} className="text-title-2 text-balance">
				{title}
			</h2>
			{action}
		</div>
	);
}

/** The store's seal: its first letter cut into a copper block, as a printer's chop. */
export function Seal({ name, className }: { name: string; className?: string }) {
	const letter = Array.from(name.trim())[0]?.toUpperCase() ?? "S";
	return (
		<span
			aria-hidden="true"
			className={cn(
				"grid size-7 shrink-0 place-items-center rounded-[5px] bg-copper text-[0.9375rem] font-extrabold leading-none tracking-normal text-background",
				className,
			)}
		>
			{letter}
		</span>
	);
}

/** The seal and the name set as an imprint: capitals, spaced wide. Always a link home. */
export function Logo({
	name,
	onDeep = false,
	className,
}: {
	name: string;
	onDeep?: boolean;
	className?: string;
}) {
	return (
		<Link
			href="/"
			aria-label={`${name}, home`}
			className={cn(
				"inline-flex min-w-0 items-center gap-2.5 text-[0.9375rem] font-semibold uppercase leading-none tracking-[0.16em] sm:text-[1.0625rem] sm:tracking-[0.22em]",
				onDeep ? "text-on-deep" : "text-foreground",
				className,
			)}
		>
			<Seal name={name} className={onDeep ? "bg-on-deep text-deep" : undefined} />
			<span className="truncate">{name}</span>
		</Link>
	);
}

/** The four trim marks, outside the corners of the positioned box they sit in. */
export function TrimMarks() {
	return (
		<>
			<span aria-hidden="true" className="trim trim-tl" />
			<span aria-hidden="true" className="trim trim-tr" />
			<span aria-hidden="true" className="trim trim-bl" />
			<span aria-hidden="true" className="trim trim-br" />
		</>
	);
}

/**
 * A photograph on its stage, the way the original shows a print: on the sheet's colour, inset,
 * with a proof's trim marks at the corners and a caption chip at the foot.
 */
export function Stage({
	src,
	alt,
	caption,
	priority = false,
	sizes = "(max-width: 1024px) 100vw, 55vw",
	className,
	frameClassName,
	tone = "stage",
}: {
	src: string;
	alt: string;
	caption?: ReactNode;
	priority?: boolean;
	sizes?: string;
	className?: string;
	frameClassName?: string;
	tone?: "stage" | "feature";
}) {
	return (
		<figure
			className={cn(
				"relative aspect-square rounded-frame lg:aspect-[6/5]",
				tone === "stage" ? "bg-stage" : "bg-white/6",
				className,
			)}
		>
			<div className={cn("absolute inset-8 lg:inset-x-16 lg:inset-y-12", frameClassName)}>
				<div className="relative size-full">
					{src.startsWith("/") ? (
						<Image
							src={src}
							alt={alt}
							fill
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
							sizes={sizes}
							className="object-cover"
						/>
					) : (
						<YNSMedia
							src={src}
							alt={alt}
							fill
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
							sizes={sizes}
							className="object-cover"
						/>
					)}
					<TrimMarks />
				</div>
			</div>
			{caption && (
				<figcaption className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)]">
					<Chip className="max-w-full truncate bg-background text-foreground">{caption}</Chip>
				</figcaption>
			)}
		</figure>
	);
}

/** Prints two across on a phone and four on a laptop. */
export const tileGridClass = "grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6";

/** A collection or a category on its small stage: its picture, its name, how many pieces. */
export function ShowcaseTile({
	href,
	image,
	title,
	meta,
	sizes = "(max-width: 1024px) 50vw, 25vw",
	priority = false,
}: {
	href: string;
	image: string | null;
	title: string;
	meta: string;
	sizes?: string;
	priority?: boolean;
}) {
	return (
		<Link href={href} className="group grid gap-0.5">
			<span className="relative mb-3 block aspect-[4/5] overflow-hidden rounded-frame bg-stage">
				{image && (
					<span className="absolute inset-6 block transition-[scale] duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.03] lg:inset-8">
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
							className="object-cover"
						/>
					</span>
				)}
			</span>
			<span className="font-semibold text-balance">{title}</span>
			<span className="text-sm text-muted-foreground">{meta}</span>
		</Link>
	);
}
