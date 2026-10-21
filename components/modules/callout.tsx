import Link from "next/link";

export type CalloutProps = {
	text: string;
	link?: { href: string; label: string };
	color?: string;
};

/** A statement set large in the page's ink, with a pill in the same colour. */
export function CalloutModule({ text, link, color }: CalloutProps) {
	return (
		<div className="mr-auto flex flex-col items-start" style={{ color }}>
			<p className="max-w-[60rem] text-ui-2xl md:text-ui-4xl">{text}</p>
			{link && (
				<Link
					href={link.href}
					className="mt-4 flex h-10 items-center rounded-full bg-offblack px-4 text-ui-sm font-bold text-white duration-200 hover:opacity-80"
					style={color ? { background: color } : undefined}
				>
					{link.label}
				</Link>
			)}
		</div>
	);
}
