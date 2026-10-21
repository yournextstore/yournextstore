import { cn } from "@/lib/utils";

/** The hand-drawn oval the original sets collection names in (its own SVG path). */
export function OvalLabel({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<span className={cn("relative flex h-8xl w-fit items-center justify-center px-2xl", className)}>
			<svg
				aria-hidden="true"
				className="absolute top-1/2 left-1/2 h-full w-[17.5rem] -translate-x-1/2 -translate-y-1/2 lg:w-[19rem]"
				fill="none"
				viewBox="0 0 305 80"
				preserveAspectRatio="none"
			>
				<path
					className="fill-background transition-colors duration-300 group-hover:fill-brand"
					d="M303.454 39.8975C303.454 44.995 299.503 50.0477 291.856 54.7901C284.25 59.5072 273.193 63.7827 259.464 67.3839C232.017 74.5834 194.059 79.045 152.102 79.045C110.145 79.045 72.1868 74.5834 44.74 67.3839C31.011 63.7827 19.9546 59.5072 12.3482 54.7901C4.70131 50.0477 0.75 44.995 0.75 39.8975C0.75 34.8001 4.70131 29.7473 12.3482 25.005C19.9546 20.2878 31.011 16.0124 44.74 12.4112C72.1868 5.21167 110.145 0.75 152.102 0.75C194.059 0.75 232.017 5.21167 259.464 12.4112C273.193 16.0124 284.25 20.2878 291.856 25.005C299.503 29.7473 303.454 34.8001 303.454 39.8975Z"
					stroke="var(--brand)"
					strokeWidth="1.5"
				/>
			</svg>
			<span className="relative z-10 whitespace-nowrap text-center font-serif text-d-sm leading-[1.5] text-brand transition-colors duration-300 group-hover:text-paper lg:text-b-6xl">
				{children}
			</span>
		</span>
	);
}
