"use client";

import { useActionState } from "react";
import { addToCart } from "./actions";

type AddToCartButtonProps = {
	variantId: string;
};

export function AddToCartButton({ variantId }: AddToCartButtonProps) {
	const [, formAction, isPending] = useActionState(
		async () => {
			await addToCart(variantId);
			return null;
		},
		null,
	);

	return (
		<form action={formAction}>
			<button
				type="submit"
				disabled={isPending}
				className="w-full bg-black text-white py-4 px-8 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isPending ? "Adding..." : "Add to Cart"}
			</button>
		</form>
	);
}
