"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";

export const SeoH1 = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	const pathname = usePathname();
	const El = pathname === "/" ? "h1" : "span";
	return <El {...props} className={cn("inline-block", className)} />;
};
