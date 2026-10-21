import { cn } from "@/lib/utils";

export function SectionHeader({
	title,
	subtitle,
	center = true,
	as: Heading = "h2",
	className,
}: {
	title: string;
	subtitle?: string;
	center?: boolean;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<header className={cn("space-y-3", center && "lg:text-center", className)}>
			<Heading
				className={cn(
					"font-serif font-bold text-foreground text-heading-3xl lg:text-heading-4xl wrap-break-word",
					Heading === "h1" && "text-heading-4xl lg:text-heading-5xl",
				)}
			>
				{title}
			</Heading>
			{subtitle ? (
				<p className="font-sans text-body-md text-muted-foreground lg:text-body-lg">{subtitle}</p>
			) : null}
		</header>
	);
}
