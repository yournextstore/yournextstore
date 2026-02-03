import { cn } from "@/lib/utils";

type MaterialIconProps = {
	name: string;
	className?: string;
};

export function MaterialIcon({ name, className }: MaterialIconProps) {
	return <span className={cn("material-icons", className)}>{name}</span>;
}
