"use client";

import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const SeoH1 = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	const pathname = usePathname();
	const El = pathname === "/" ? "h1" : "span";
	return <El {...props} className={cn("inline-block", className)} />;
};
