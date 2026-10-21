import { cn } from "@/lib/utils";

/** Pasargad's section heading: a bold 3xl title over one muted line. */
export function Heading({
	title,
	description,
	as: Tag = "h2",
	className,
}: {
	title: string;
	description?: string | null;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<div className={cn("my-4", className)}>
			<Tag className="text-3xl font-bold tracking-tight wrap-break-word">{title}</Tag>
			{description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
		</div>
	);
}
