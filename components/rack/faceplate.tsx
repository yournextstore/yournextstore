import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A module faceplate holding a catalogue photo: screws in the corners, a mono legend on top,
 * a status LED and two jacks underneath. Any studio shot reads as a piece of hardware in the rack.
 */
export function Faceplate({
	legend,
	children,
	led = "amber",
	className,
	size = "card",
}: {
	legend: string;
	children: ReactNode;
	led?: "amber" | "green" | "off";
	className?: string;
	size?: "card" | "page";
}) {
	const page = size === "page";
	return (
		<div
			className={cn(
				"relative flex flex-col items-center border border-line bg-[linear-gradient(175deg,var(--rk-face),var(--rk-face-2))]",
				page
					? "rounded-[14px] px-[6%] pt-[4.2%] pb-[5%] shadow-[var(--rk-shadow)]"
					: "rounded-[6px] px-[7%] pt-[5%] pb-[6%]",
				className,
			)}
		>
			<span aria-hidden="true" className="screw-ui absolute top-[3%] left-[5%]" />
			<span aria-hidden="true" className="screw-ui absolute top-[3%] right-[5%] [--rk-tilt:120deg]" />
			<span aria-hidden="true" className="screw-ui absolute bottom-[2.5%] left-[5%] [--rk-tilt:80deg]" />
			<span aria-hidden="true" className="screw-ui absolute right-[5%] bottom-[2.5%] [--rk-tilt:10deg]" />
			<div className={cn("flex w-full items-center justify-center", page ? "mb-[4%]" : "mb-[5%]")}>
				<span
					className={cn(
						"font-plate max-w-full truncate tracking-[0.12em] text-plate",
						page ? "text-[0.8rem] tracking-[0.18em]" : "text-[7.5px] min-[400px]:text-[9px]",
					)}
					aria-hidden="true"
				>
					{legend}
				</span>
				{led !== "off" && (
					<span
						aria-hidden="true"
						className={cn(
							"absolute rounded-full",
							page ? "top-[5%] right-[11%] h-2 w-2" : "top-[7%] right-[13%] h-[5px] w-[5px]",
							led === "amber" ? "bg-led shadow-[0_0_8px_var(--rk-glow)]" : "bg-led-green",
						)}
					/>
				)}
			</div>
			<div className="relative aspect-square w-full overflow-hidden rounded-[4px] border border-line bg-[#e9e8e4]">
				{children}
			</div>
			<div
				aria-hidden="true"
				className={cn("flex w-full justify-between px-[14%]", page ? "mt-[5%]" : "mt-[6%]")}
			>
				<span className={cn("jack-ui", page && "h-[18px] w-[18px]")} />
				<span className={cn("jack-ui", page && "h-[18px] w-[18px]")} />
			</div>
		</div>
	);
}
