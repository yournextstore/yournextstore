"use client";

import { Drawer, DrawerContent, DrawerTitle } from "@/ui/shadcn/drawer";
import { useMediaQuery } from "@/ui/shadcn/hooks/use-media-query";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

export const CartAsideDrawer = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				router.back();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [router]);

	const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

	const isDesktop = useMediaQuery("(min-width: 640px)");

	return (
		<Drawer
			open={open}
			shouldScaleBackground={true}
			direction={isDesktop ? "right" : "bottom"}
			onOpenChange={(e) => {
				if (!e) {
					if (timerId.current) {
						clearTimeout(timerId.current);
					}
					timerId.current = setTimeout(() => {
						router.back();
					}, 100);
				}
			}}
		>
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
