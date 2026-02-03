import { cn } from "@/lib/utils";

type ProductBadgeProps = {
	variant: "hot" | "sale" | "new";
	className?: string;
};

const variantStyles = {
	hot: "bg-secondary text-black",
	sale: "bg-red-500 text-white",
	new: "bg-primary text-white rounded-full px-3",
};

const variantLabels = {
	hot: "HOT",
	sale: "SALE",
	new: "New",
};

export function ProductBadge({ variant, className }: ProductBadgeProps) {
	return (
		<span className={cn("text-xs font-bold px-2 py-1 rounded", variantStyles[variant], className)}>
			{variantLabels[variant]}
		</span>
	);
}
