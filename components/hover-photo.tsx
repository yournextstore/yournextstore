"use client";

import { useSyncExternalStore } from "react";
import { YNSMedia } from "@/lib/yns-media";

const QUERY = "(hover: hover) and (pointer: fine)";
const subscribe = (onChange: () => void) => {
	const query = window.matchMedia(QUERY);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
};

/**
 * A card's next photo (on the model), rising over the first like a sheet when the card is
 * pointed at. Only pointers that can hover get it, so touch screens never download it.
 */
export function HoverPhoto({ src, sizes }: { src: string; sizes: string }) {
	const canHover = useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false,
	);
	if (!canHover) return null;
	return (
		<span className="absolute inset-0 transition-[clip-path,opacity] duration-300 ease-out [clip-path:inset(100%_0_0_0_round_24px_24px_0_0)] group-hover/piece:duration-500 group-hover/piece:[clip-path:inset(0_0_0_0_round_0px)] group-has-[:focus-visible]/piece:[clip-path:inset(0_0_0_0_round_0px)] motion-reduce:opacity-0 motion-reduce:[clip-path:none] motion-reduce:group-hover/piece:opacity-100">
			<YNSMedia
				src={src}
				alt=""
				fill
				sizes={sizes}
				fetchPriority="low"
				className="scale-110 object-cover transition-transform duration-300 ease-out group-hover/piece:scale-100 group-hover/piece:duration-700 motion-reduce:scale-100"
			/>
		</span>
	);
}
