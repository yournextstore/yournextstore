import React, { type FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
export const AlignJustifyDropdown: FC<{
	links: {
		label: string;
		href: string;
	}[];
}> = ({ links }) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button aria-label="Customise options">
					<AlignJustify />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
					sideOffset={5}
				>
					{links.map((link, index) => (
						<Link href={link.href} key={index}>
							<DropdownMenu.Item className="text-violet11 data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
								{link.label}
							</DropdownMenu.Item>
						</Link>
					))}
					<DropdownMenu.Arrow className="fill-white" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};
