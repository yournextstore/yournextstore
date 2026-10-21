import { cn } from "@/lib/utils";

/** The reference's bordered logo square, carrying the store's initial instead of a brand mark. */
export function LogoMark({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
	const initial = (name.trim()[0] ?? "S").toUpperCase();
	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex flex-none items-center justify-center border border-neutral-200 bg-white font-semibold text-black dark:border-neutral-700 dark:bg-black dark:text-white",
				size === "md" ? "h-10 w-10 rounded-xl text-base" : "h-[30px] w-[30px] rounded-lg text-xs",
			)}
		>
			{initial}
		</span>
	);
}
