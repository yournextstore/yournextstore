"use client";

import { Heart } from "lucide-react";

export function WishlistButton() {
	return (
		<button
			type="button"
			className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-soft hover:bg-secondary transition-colors text-pink-500"
			aria-label="Wishlist"
		>
			<Heart className="w-5 h-5" fill="currentColor" />
		</button>
	);
}
