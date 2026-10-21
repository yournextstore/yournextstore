import { cn } from "@/lib/utils";

/**
 * Text lockup in the spirit of the original's: a monogram in a hairline ring above the store
 * name in gold display capitals. The monogram folds away when the header compacts.
 */
export function LogoLockup({
	name,
	className,
	mark = true,
}: {
	name: string;
	className?: string;
	mark?: boolean;
}) {
	const initial = name.trim().charAt(0) || "Y";
	return (
		<span className={cn("flex flex-col items-center text-gold", className)}>
			{mark && (
				<span
					aria-hidden="true"
					className="logo-mark mb-1 grid max-h-10 size-9 place-items-center rounded-full border border-gold/60 font-accent text-xl italic leading-none lg:size-10"
				>
					{initial}
				</span>
			)}
			<span className="max-w-[11rem] truncate font-display lg:max-w-[16rem] text-xl uppercase leading-none tracking-[0.06em] lg:text-2xl">
				{name}
			</span>
		</span>
	);
}
