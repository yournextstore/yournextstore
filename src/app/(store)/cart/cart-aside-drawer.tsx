"use client";

import type { ReactNode } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/components/ui/hooks/use-media-query";
import { useCartModal } from "@/context/cart-modal";

export const CartAsideDrawer = ({ children }: { children: ReactNode }) => {
	const { open, setOpen } = useCartModal();

	const isDesktop = useMediaQuery("(min-width: 640px)");

	return (
		<Drawer open={open} shouldScaleBackground={true} direction={isDesktop ? "right" : "bottom"}>
			<DrawerTitle className="sr-only">Shopping cart</DrawerTitle>
			<DrawerContent
				className="sm:fixed sm:bottom-0 sm:left-auto sm:right-0 sm:top-0 sm:mt-0 sm:flex sm:h-full sm:w-1/2 sm:flex-col sm:overflow-hidden sm:rounded-none sm:bg-white sm:shadow-xl lg:w-1/3"
				aria-describedby="cart-overlay-description"
				onPointerDownOutside={() => {
					setOpen(false);
				}}
				onEscapeKeyDown={() => {
					setOpen(false);
				}}
			>
				{children}
			</DrawerContent>
		</Drawer>
	);
};
