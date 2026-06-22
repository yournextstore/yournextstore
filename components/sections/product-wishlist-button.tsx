"use client";

import { Heart } from "lucide-react";

export function ProductWishlistButton() {
	return (
		<button
			type="button"
			className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-pink-500 transition-colors z-10"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			aria-label="Add to wishlist"
		>
			<Heart className="w-4 h-4" />
		</button>
	);
}
