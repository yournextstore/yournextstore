"use client";

import Link from "next/link";
import type { Piece } from "@/lib/catalog";
import { savedOf } from "@/lib/saved";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { BagButton } from "./bag-button";
import { HeartPin } from "./vault";

function plateLabel(piece: Piece) {
	return (piece.category?.name ?? "the register").toLocaleLowerCase();
}

function StockNote({ piece }: { piece: Piece }) {
	if (piece.stock === "out") return <span className="eti text-[10px] text-acc">Sold out</span>;
	if (piece.stock === "low") return <span className="eti text-[10px] text-acc">Last pieces</span>;
	return null;
}

/** Grid card: photograph with a paper plate label and a heart, then the printed record. */
export function PieceCard({
	piece,
	priority = false,
	headingLevel = 2,
}: {
	piece: Piece;
	priority?: boolean;
	headingLevel?: 2 | 3;
}) {
	const Heading = headingLevel === 2 ? "h2" : "h3";
	return (
		<article className="group flex min-w-0 flex-col gap-3.5">
			<div className="relative">
				<Link
					href={piece.href}
					className="hatch relative flex aspect-[3/4] w-full items-end overflow-hidden border border-line p-3"
				>
					{piece.image ? (
						<YNSMedia
							src={piece.image}
							alt={piece.name}
							fill
							priority={priority}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
							className="object-cover transition duration-500 group-hover:scale-[1.015]"
						/>
					) : null}
					<span className="plate-label relative">{plateLabel(piece)}</span>
				</Link>
				<HeartPin piece={savedOf(piece)} className="absolute right-2.5 top-2.5" />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="eti text-[10px] text-faint">No. {piece.no}</span>
				<Heading className="font-sf text-[18px] leading-[1.25]">
					<Link href={piece.href} className="transition hover:text-acc">
						{piece.name}
					</Link>
				</Heading>
				{piece.detail ? <span className="text-[13px] text-soft">{piece.detail}</span> : null}
				<div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
					<span className="font-mono text-[13px]">{piece.priceLabel}</span>
					{piece.compareLabel ? (
						<s className="font-mono text-[11px] text-faint">{piece.compareLabel}</s>
					) : null}
					<StockNote piece={piece} />
				</div>
				<BagButton piece={piece} className="mt-2 w-full" />
			</div>
		</article>
	);
}

/** List row: thumbnail, reference line, serif name, excerpt, and a price column. */
export function PieceRow({ piece }: { piece: Piece }) {
	const availability =
		piece.stock === "out" ? "Sold out" : piece.stock === "low" ? "Last pieces" : "In stock";
	return (
		<article className="flex flex-wrap items-start gap-x-[26px] gap-y-4 border-b border-line py-[22px] transition hover:bg-card">
			<div className="relative flex-none">
				<Link
					href={piece.href}
					className="hatch relative block aspect-[4/5] w-[110px] overflow-hidden border border-line"
				>
					{piece.image ? (
						<YNSMedia src={piece.image} alt={piece.name} fill sizes="110px" className="object-cover" />
					) : null}
				</Link>
				<HeartPin piece={savedOf(piece)} className="absolute right-1.5 top-1.5" />
			</div>
			<div className="flex min-w-0 flex-[1_1_300px] flex-col gap-[7px]">
				<span className="eti text-[10px] text-faint">
					{piece.category ? `${piece.category.name} · ` : ""}No. {piece.no}
				</span>
				<h2 className="font-sf text-[20px] leading-[1.25]">
					<Link href={piece.href} className="transition hover:text-acc">
						{piece.name}
					</Link>
				</h2>
				{piece.excerpt ? (
					<p className="max-w-[62ch] text-[13.5px] leading-[1.6] text-soft">{piece.excerpt}</p>
				) : null}
				{piece.detail ? <span className="font-mono text-[11px] text-faint">{piece.detail}</span> : null}
			</div>
			<div className="flex flex-[0_1_170px] flex-col gap-1.5">
				<span className="font-mono text-[14px]">{piece.priceLabel}</span>
				{piece.compareLabel ? <s className="font-mono text-[11px] text-faint">{piece.compareLabel}</s> : null}
				<span className={cn("eti text-[10px]", piece.stock === "in" ? "text-dim" : "text-acc")}>
					{availability}
				</span>
				<BagButton piece={piece} className="mt-2" />
			</div>
		</article>
	);
}
