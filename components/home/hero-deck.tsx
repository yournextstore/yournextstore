"use client";

import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { wrap } from "./use-hero-rotation";

type DeckPiece = { id: string; href: string; image: string };

const SWIPE_DISTANCE = 56;
const SWIPE_SPEED = 0.5;
/** How many of the next pieces show behind the front one. */
const QUEUE = 2;
const HIDDEN = "pointer-events-none opacity-0";

/** Where a card sits, by how many pieces it is away from the front one. */
function placement(slot: number, queue: number) {
	if (slot < 0) {
		return cn(
			HIDDEN,
			"z-40 -translate-x-[42%] -rotate-6 scale-95 motion-reduce:translate-x-0 motion-reduce:rotate-0 motion-reduce:scale-100",
		);
	}
	if (slot === 0) return "z-30";
	if (slot === 1 && queue >= 1) return "z-20 translate-x-[58%] translate-y-[2%] rotate-[5deg] scale-[0.78]";
	if (slot === 2 && queue >= 2) {
		// Phones only have room for the next piece to peek in.
		return "z-10 translate-x-[102%] translate-y-[4%] rotate-[9deg] scale-[0.6] max-lg:opacity-0";
	}
	return cn(HIDDEN, "translate-x-[132%] translate-y-[5%] rotate-[12deg] scale-50");
}

/**
 * The hero photos as a deck: the current piece upright in front, the next ones fanned out to
 * its right. A change slides every card one place along (700ms ease-out), so rapid changes
 * retarget instead of restarting. On touch the front card can be swiped.
 */
export function HeroDeck({
	pieces,
	step,
	settle,
	onShift,
}: {
	pieces: readonly DeckPiece[];
	step: number;
	settle: boolean;
	onShift: (delta: number) => void;
}) {
	const count = pieces.length;
	const queue = Math.min(QUEUE, count - 1);
	const reach = Math.max(queue, Math.floor(count / 2));
	const slots = Array.from({ length: queue + 2 * reach + 1 }, (_, position) => position - reach);
	const drag = useRef<{
		pointer: number;
		x: number;
		at: number;
		card: HTMLElement | null;
		active: boolean;
	} | null>(null);
	const swiped = useRef(false);

	const endDrag = (event: React.PointerEvent, cancelled: boolean) => {
		const gesture = drag.current;
		if (!gesture || gesture.pointer !== event.pointerId) return;
		drag.current = null;
		if (!gesture.active || !gesture.card) return;
		const travel = event.clientX - gesture.x;
		const speed = travel / Math.max(event.timeStamp - gesture.at, 1);
		gesture.card.style.transition = "";
		gesture.card.style.transform = "";
		swiped.current = true;
		if (!cancelled && (Math.abs(travel) > SWIPE_DISTANCE || Math.abs(speed) > SWIPE_SPEED)) {
			onShift(travel < 0 ? 1 : -1);
		}
	};

	return (
		<div
			aria-hidden="true"
			data-hero-claim=""
			onClickCapture={(event) => {
				if (!swiped.current) return;
				swiped.current = false;
				event.preventDefault();
				event.stopPropagation();
			}}
			onPointerDown={(event) => {
				swiped.current = false;
				if (event.pointerType === "mouse" || count < 2) return;
				drag.current = {
					pointer: event.pointerId,
					x: event.clientX,
					at: event.timeStamp,
					card: event.currentTarget.querySelector<HTMLElement>('[data-deck-slot="0"]'),
					active: false,
				};
			}}
			onPointerMove={(event) => {
				const gesture = drag.current;
				if (!gesture?.card || gesture.pointer !== event.pointerId) return;
				const travel = event.clientX - gesture.x;
				if (!gesture.active) {
					if (Math.abs(travel) < 10) return;
					gesture.active = true;
					gesture.card.style.transition = "none";
					event.currentTarget.setPointerCapture(event.pointerId);
				}
				gesture.card.style.transform = `translateX(${travel}px) rotate(${travel / 24}deg)`;
			}}
			onPointerUp={(event) => endDrag(event, false)}
			onPointerCancel={(event) => endDrag(event, true)}
			className="absolute left-1/2 top-[70px] aspect-[2/3] w-64 -translate-x-1/2 touch-pan-y select-none lg:top-[calc(var(--hero-u)*150)] lg:w-[min(30vw,calc(var(--hero-u)*432))]"
		>
			{slots.map((slot) => {
				const place = step + slot;
				const piece = pieces[wrap(place, count)];
				if (!piece) return null;
				const queued = slot >= 1 && slot <= queue;
				const settles = settle && place >= 0 && place <= queue;
				return (
					<div
						key={place}
						data-deck-slot={slot}
						className={cn(
							"absolute inset-0 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-opacity",
							placement(slot, queue),
						)}
					>
						<div
							className={cn(
								"relative size-full overflow-hidden rounded-photo bg-photo shadow-hero lg:rounded-photo-lg",
								settles && "animate-fade-scale",
							)}
							style={settles ? { animationDelay: `${200 + place * 120}ms` } : undefined}
						>
							<YNSMedia
								src={piece.image}
								alt=""
								fill
								priority={place === 0}
								draggable={false}
								sizes="(max-width: 1023px) 256px, 30vw"
								className="object-cover"
							/>
						</div>
						{slot === 0 ? (
							<Link href={piece.href} tabIndex={-1} draggable={false} className="absolute inset-0" />
						) : queued ? (
							<button
								type="button"
								tabIndex={-1}
								onClick={() => onShift(slot)}
								className="absolute inset-0 cursor-pointer"
							/>
						) : null}
					</div>
				);
			})}
		</div>
	);
}
