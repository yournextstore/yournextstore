import Link from "next/link";
import type { ColorTheme } from "@/lib/color-theme";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type CollectionModuleProps = {
	name: string;
	href: string;
	image: string | null;
	theme: ColorTheme;
};

/** A collection cut into a soft shape: its photograph inside the mask, the name and a white pill on top. */
export function CollectionModule({ name, href, image, theme }: CollectionModuleProps) {
	return (
		<Link
			href={href}
			className="group relative flex aspect-[4/3] h-full w-full flex-col items-center justify-center md:aspect-square"
		>
			<div
				className={cn(
					"absolute inset-2 overflow-hidden duration-1000 ease-out group-hover:scale-[1.01]",
					theme.shape,
				)}
				style={{ background: theme.text }}
			>
				{image && (
					<>
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-black/30 duration-500 ease-out group-hover:bg-black/40" />
					</>
				)}
			</div>
			<span className="relative mt-[0.5em] w-[65%] text-center text-ui-2xl text-white group-hover:underline md:text-ui-3xl">
				{name}
			</span>
			<span className="relative mt-6 flex h-10 items-center rounded-full bg-white px-4 text-ui-sm font-bold text-offblack">
				Shop collection
			</span>
		</Link>
	);
}
