"use client";

export function HighlightedText({
	text,
	query,
	className,
}: {
	text: string;
	query: string;
	className?: string;
}) {
	if (!query) return <span className={className}>{text}</span>;
	const idx = text.toLowerCase().indexOf(query.toLowerCase());
	if (idx === -1) return <span className={className}>{text}</span>;
	return (
		<span className={className}>
			{text.slice(0, idx)}
			<mark className="bg-transparent font-semibold text-foreground">
				{text.slice(idx, idx + query.length)}
			</mark>
			{text.slice(idx + query.length)}
		</span>
	);
}
