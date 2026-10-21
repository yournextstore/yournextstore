import Link from "next/link";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type CallToActionProps = {
	title: string;
	body: string;
	link: { href: string; label: string };
	image: string | null;
	layout?: "left" | "right";
};

/** A wide photograph beside a short statement and an underlined link. */
export function CallToActionModule({ title, body, link, image, layout = "left" }: CallToActionProps) {
	return (
		<div
			className={cn(
				"flex gap-5 md:gap-[5vw]",
				layout === "left" ? "flex-col md:flex-row" : "flex-col-reverse md:flex-row-reverse",
			)}
		>
			<div className="relative aspect-[864/485] grow overflow-hidden rounded-md bg-lightgray">
				{image && (
					<YNSMedia src={image} alt="" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
				)}
			</div>
			<div className="mr-auto flex w-full shrink-0 flex-col items-start md:max-w-[20rem]">
				<h2 className="text-ui-xl font-bold md:text-ui-2xl">{title}</h2>
				<p className="mt-4 leading-paragraph">{body}</p>
				<Link href={link.href} className="mt-4 font-bold underline hover:no-underline">
					{link.label}
				</Link>
			</div>
		</div>
	);
}
