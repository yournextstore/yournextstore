import { CircleHelp, Lock, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
	{ icon: Truck, label: "Delivery at checkout" },
	{ icon: Lock, label: "Secure payment" },
	{ icon: CircleHelp, label: "Help Centre" },
];

/** Three icon-over-label notes under the buy button: neutral, nothing the store has not set. */
export function FeatureIcons({ className }: { className?: string }) {
	return (
		<ul
			className={cn(
				"flex items-center justify-between gap-8 rounded-md p-4 text-center sm:gap-4 md:w-fit",
				className,
			)}
		>
			{features.map(({ icon: Icon, label }) => (
				<li key={label} className="flex flex-col items-center justify-center gap-2 sm:mx-4">
					<Icon aria-hidden />
					<span className="text-sm">{label}</span>
				</li>
			))}
		</ul>
	);
}
