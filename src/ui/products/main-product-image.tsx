import Image from "next/image";
import type { ComponentPropsWithRef } from "react";

export const MainProductImage = (
	props: Omit<ComponentPropsWithRef<typeof Image>, "width" | "height" | "sizes">,
) => {
	return (
		<Image
			// using exactly the same width, height adn sizes as the main product image
			// to avoid loading the same image twice
			width={700}
			height={700}
			sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
			{...props}
		/>
	);
};
