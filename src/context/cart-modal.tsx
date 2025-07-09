"use client";

import { usePathname } from "next/navigation";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { invariant } from "@/lib/utils";

type CartModalProviderValue = { open: boolean; setOpen: (open: boolean) => void };
const CartModalContext = createContext<CartModalProviderValue | null>(null);

export const CartModalProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	useEffect(() => {
		setOpen(false);
	}, [pathname]);
	return <CartModalContext value={{ open, setOpen }}>{children}</CartModalContext>;
};

export const useCartModal = () => {
	const ctx = use(CartModalContext);
	invariant(ctx, "useCartModal must be used within a provider ");

	return ctx;
};
