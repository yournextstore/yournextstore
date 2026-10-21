"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type BagProduct, type BagVariant, useAddToBag } from "@/components/use-add-to-bag";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { HeroDeck } from "./hero-deck";
import { RotationToggle } from "./rotation-toggle";
import { useHeroRotation } from "./use-hero-rotation";

export type ShowcaseVariant = BagVariant & {
	label: string;
	priceText: string;
	available: boolean;
};

export type ShowcasePiece = {
	product: BagProduct;
	href: string;
	image: string;
	word: string;
	wordSize: { mobile: string; desktop: string };
	categoryLabel: string;
	priceText: string;
	/** The option's name ("Color", "Size") when the piece comes in more than one. */
	optionLabel: string | null;
	variants: ShowcaseVariant[];
};

// The entrance plays on the first load of the session and on every change of piece, never
// when the visitor comes back to the home page.
let entrancePlayed = false;

/** Pills for a few short options (sizes); a pill-shaped select for long lists (colours). */
const usesPills = (variants: ShowcaseVariant[]) =>
	variants.length <= 4 && variants.every((variant) => variant.label.length <= 8);

function OptionPills({
	variants,
	value,
	onChange,
}: {
	variants: ShowcaseVariant[];
	value: string | undefined;
	onChange: (id: string) => void;
}) {
	return (
		<div className="flex flex-wrap gap-[5px]">
			{variants.map((variant) => {
				const selected = variant.id === value;
				return (
					<button
						key={variant.id}
						type="button"
						disabled={!variant.available}
						aria-pressed={selected}
						aria-label={variant.available ? undefined : `${variant.label}, out of stock`}
						onClick={() => onChange(variant.id)}
						className={cn(
							"press h-11 min-w-12 rounded-full border px-3.5 text-[13px] transition-colors duration-200",
							selected
								? "border-foreground bg-foreground text-background"
								: variant.available
									? "border-line hover:border-foreground"
									: "border-dashed border-line line-through opacity-65",
						)}
					>
						{variant.label}
					</button>
				);
			})}
		</div>
	);
}

function OptionSelect({
	label,
	variants,
	value,
	onChange,
	className,
}: {
	label: string;
	variants: ShowcaseVariant[];
	value: string | undefined;
	onChange: (id: string) => void;
	className?: string;
}) {
	return (
		<label className={cn("relative block", className)}>
			<span className="sr-only">{label}</span>
			<select
				value={value}
				onChange={(event) => onChange(event.target.value)}
				className="h-full w-full appearance-none rounded-full border border-line bg-transparent pl-4 pr-9 text-[13px] text-foreground hover:border-foreground"
			>
				{variants.map((variant) => (
					<option key={variant.id} value={variant.id} disabled={!variant.available}>
						{variant.label}
					</option>
				))}
			</select>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px]"
			>
				▼
			</span>
		</label>
	);
}

/**
 * Home: a hero that fits the first screen and works as a carousel. The piece's word rises
 * letter by letter behind a deck of photos; below come the pieces as chips, the section bands
 * and a "Goes with" rail for the piece in front.
 */
export function HeroShowcase({
	pieces,
	sections,
	bands,
	rails,
}: {
	pieces: ShowcasePiece[];
	sections: { href: string; name: string }[];
	bands: React.ReactNode;
	rails: React.ReactNode[];
}) {
	const heroRef = useRef<HTMLElement>(null);
	const rotation = useHeroRotation(pieces.length, heroRef);
	const { index, moves } = rotation;
	const [firstLoad] = useState(() => !entrancePlayed);
	const [picked, setPicked] = useState<Record<string, string>>({});
	const addToBag = useAddToBag();
	useEffect(() => {
		entrancePlayed = true;
	}, []);

	const piece = pieces[index];
	if (!piece) return null;
	const variant =
		piece.variants.find((option) => option.id === picked[piece.product.id]) ??
		piece.variants.find((option) => option.available) ??
		piece.variants[0];
	const choose = (id: string) => setPicked((current) => ({ ...current, [piece.product.id]: id }));
	const animate = firstLoad || moves > 0;
	const letters = piece.word.toUpperCase().split("");
	const multiple = piece.variants.length > 1;
	const addLabel = !variant?.available
		? "Sold out"
		: multiple && usesPills(piece.variants)
			? `Add ${variant.label} to bag — ${variant.priceText}`
			: `Add to bag — ${variant.priceText}`;
	const add = () => {
		if (variant?.available) addToBag(variant, piece.product);
	};

	const toggle = rotation.rotates ? (
		<RotationToggle
			playing={rotation.playing}
			stopped={rotation.stopped}
			cycle={moves}
			onToggle={rotation.toggle}
			className="size-11 lg:size-[52px]"
		/>
	) : null;

	const addButton = (
		<button
			type="button"
			onClick={add}
			disabled={!variant?.available}
			className="press h-14 w-full whitespace-nowrap rounded-full bg-foreground px-4 text-[14px] font-semibold lg:px-6 lg:text-[15px] text-background transition-colors hover:bg-ink-hover disabled:opacity-65"
		>
			{addLabel}
		</button>
	);

	return (
		<>
			<section
				ref={heroRef}
				aria-roledescription="carousel"
				aria-label="Featured pieces"
				{...rotation.hold}
				className="hero relative isolate -mx-4 overflow-x-clip px-4 pb-10 lg:-mx-8 lg:h-[var(--hero-h)] lg:px-8 lg:pb-0 lg:pt-6"
			>
				<div className="relative h-[470px] lg:static lg:h-auto">
					<p
						style={
							{ "--word-m": piece.wordSize.mobile, "--word-d": piece.wordSize.desktop } as React.CSSProperties
						}
						className="absolute inset-x-0 top-0 whitespace-nowrap text-center font-display text-[length:var(--word-m)] leading-[0.85] lg:static lg:text-[length:min(var(--word-d),calc(var(--hero-u)*316))] lg:leading-[0.82]"
					>
						<span className="sr-only">{piece.word}</span>
						<span key={moves} aria-hidden="true" className="inline-flex overflow-hidden align-top">
							{letters.map((letter, position) => (
								<span
									key={position}
									aria-hidden="true"
									className={cn("inline-block whitespace-pre", animate && "animate-rise")}
									style={{ animationDelay: `${position * 28}ms` }}
								>
									{letter}
								</span>
							))}
						</span>
					</p>
					<HeroDeck
						pieces={pieces.map((option) => ({
							id: option.product.id,
							href: option.href,
							image: option.image,
						}))}
						step={rotation.step}
						settle={firstLoad}
						onShift={rotation.shift}
					/>
				</div>

				{/* Piece details: under the photo on phones, bottom-left on desktop. */}
				<div
					data-hero-hold=""
					className="flex flex-col gap-3.5 lg:absolute lg:bottom-[calc(var(--hero-u)*48)] lg:left-8 lg:w-[min(360px,26vw)] lg:gap-[max(12px,calc(var(--hero-u)*18))]"
				>
					<div data-hero-claim="" aria-live={rotation.playing ? "off" : "polite"} aria-atomic="true">
						<div
							key={moves}
							className={cn(
								"flex items-end justify-between gap-3 lg:flex-col lg:items-start lg:gap-[max(12px,calc(var(--hero-u)*18))]",
								moves > 0 && "animate-fade-in",
							)}
						>
							<div className="flex min-w-0 flex-col gap-1 lg:gap-[max(10px,calc(var(--hero-u)*16))]">
								<span className="text-xs text-muted-foreground lg:text-[13px]">
									{piece.categoryLabel}
									{multiple ? ` · ${piece.variants.length} options` : ""}
								</span>
								<h2 className="font-display-75 text-[22px] leading-none wrap-break-word lg:text-[length:max(26px,calc(var(--hero-u)*38))] lg:leading-[0.95]">
									<Link href={piece.href}>{piece.product.name}</Link>
								</h2>
							</div>
							<span className="whitespace-nowrap text-lg font-medium tabular-nums lg:text-[length:max(18px,calc(var(--hero-u)*22))]">
								{variant?.priceText ?? piece.priceText}
							</span>
						</div>
					</div>

					{/* Phones: the pieces as photo dots. */}
					<div className="flex items-center gap-1 lg:hidden">
						{pieces.map((option, position) => (
							<button
								key={option.product.id}
								type="button"
								aria-label={`Show ${option.word}`}
								aria-pressed={position === index}
								onClick={() => rotation.show(position)}
								className="press grid size-11 place-items-center rounded-full aria-pressed:shadow-[0_0_0_1.5px_var(--foreground)]"
							>
								<span className="relative size-8 overflow-hidden rounded-full bg-photo shadow-[0_0_0_1px_var(--line)]">
									<YNSMedia src={option.image} alt="" fill sizes="32px" className="object-cover" />
								</span>
							</button>
						))}
						<span className="ml-auto text-xs">{pieces.length} pieces</span>
						{toggle}
					</div>

					{multiple ? (
						<div data-hero-claim="" className="hidden lg:block">
							{usesPills(piece.variants) ? (
								<OptionPills variants={piece.variants} value={variant?.id} onChange={choose} />
							) : (
								<OptionSelect
									label={piece.optionLabel ?? "Option"}
									variants={piece.variants}
									value={variant?.id}
									onChange={choose}
									className="h-11 w-full"
								/>
							)}
						</div>
					) : null}
					<div data-hero-claim="" className="hidden lg:block">
						{addButton}
					</div>
				</div>

				{/* Desktop: piece counter, rotation toggle and next. */}
				<div className="absolute bottom-[calc(var(--hero-u)*48)] right-8 hidden flex-col items-end gap-4 lg:flex">
					<span className="font-display text-[length:max(40px,calc(var(--hero-u)*64))] leading-none tabular-nums">
						{String(index + 1).padStart(2, "0")}
						<span className="opacity-60">/{String(pieces.length).padStart(2, "0")}</span>
					</span>
					<div className="flex items-center gap-2">
						{toggle}
						<button
							type="button"
							onClick={() => rotation.shift(1)}
							className="press flex h-[52px] items-center gap-2.5 rounded-full border border-foreground px-[22px] font-medium transition-colors hover:bg-foreground hover:text-background"
						>
							Next piece
							<ArrowRight className="size-4" aria-hidden="true" />
						</button>
					</div>
				</div>

				{/* Phones: sections and quick add pinned under the hero. */}
				<div className="mt-8 flex flex-col gap-3 lg:hidden">
					<nav
						aria-label="Sections"
						className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]"
					>
						{sections.map((section) => (
							<Link
								key={section.href}
								href={section.href}
								className="flex h-11 shrink-0 items-center rounded-full border border-line px-4 text-[13px]"
							>
								{section.name}
							</Link>
						))}
					</nav>
					<div data-hero-hold="" data-hero-claim="" className="flex gap-2">
						{multiple ? (
							<OptionSelect
								label={piece.optionLabel ?? "Option"}
								variants={piece.variants}
								value={variant?.id}
								onChange={choose}
								className="h-14 w-[34%] max-w-40 shrink-0"
							/>
						) : null}
						<div className="min-w-0 grow">{addButton}</div>
					</div>
				</div>
			</section>

			<section className="flex flex-col gap-4 pb-20">
				<h2 className="text-[13px] text-muted-foreground">Shop by piece</h2>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
					{pieces.map((option, position) => (
						<button
							key={option.product.id}
							type="button"
							aria-pressed={position === index}
							onClick={() => rotation.show(position)}
							className="press flex items-center gap-3.5 rounded-chip border border-line p-2 pr-4 text-left transition-colors hover:border-foreground aria-pressed:border-foreground aria-pressed:bg-wash"
						>
							<span className="relative h-[72px] w-14 shrink-0 overflow-hidden rounded-[14px] bg-photo">
								<YNSMedia src={option.image} alt="" fill sizes="56px" className="object-cover" />
							</span>
							<span className="flex min-w-0 grow flex-col">
								<span className="font-medium">{option.word}</span>
								<span className="truncate text-[13px] text-muted-foreground">{option.categoryLabel}</span>
							</span>
							<span className="shrink-0 text-[13px] tabular-nums">{option.priceText}</span>
						</button>
					))}
				</div>
			</section>

			{bands}

			{rails[index] ? (
				<section className="flex flex-col gap-7 py-16 lg:py-24">
					<div className="flex items-end justify-between gap-4">
						<h2 className="font-display text-[48px] leading-[0.9] lg:text-[min(96px,6.6vw)]">
							Goes with {piece.word}
						</h2>
						<span aria-hidden="true" className="text-sm text-muted-foreground lg:hidden">
							Swipe →
						</span>
					</div>
					{rails[index]}
				</section>
			) : null}
		</>
	);
}
