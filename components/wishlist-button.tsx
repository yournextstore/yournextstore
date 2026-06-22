"use client";

import { HeartIcon } from "lucide-react";

export function WishlistButton() {
	return (
		<button
			type="button"
			aria-label="Add to wishlist"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-foreground/80 backdrop-blur transition-all hover:bg-white hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
		>
			<HeartIcon className="h-4 w-4" strokeWidth={1.5} />
		</button>
	);
}
