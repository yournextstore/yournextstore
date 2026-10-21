import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** The long right arrow every call to action in the original carries. */
export function Arrow({ className }: { className?: string }) {
	return <MoveRight aria-hidden="true" className={cn("h-5 w-5 shrink-0", className)} />;
}
