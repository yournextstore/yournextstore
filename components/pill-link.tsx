import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** The original's call to action: a white pill with slate text, set on photographs and olive panels. */
export const pillClassName =
	"inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-base whitespace-nowrap text-slate-800 shadow-sm transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function PillLink({ className, ...props }: ComponentProps<typeof Link>) {
	return <Link className={cn(pillClassName, className)} {...props} />;
}
