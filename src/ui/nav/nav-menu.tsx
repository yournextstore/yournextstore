"use client";

import * as React from "react";

// TODO https://github.com/radix-ui/primitives/issues/2769

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/ui/shadcn/navigation-menu";
import { YnsLink } from "@/ui/yns-link";
import { useState } from "react";

type NavLink = {
	label: string;
	href: string;
};

export function NavMenu({ links }: { links: NavLink[] }) {
	const [value, setValue] = useState<string | undefined>(undefined);

	return (
		<NavigationMenu value={value} onValueChange={setValue}>
			<NavigationMenuList>
				{links.map((link) => (
					<NavigationMenuItem key={link.label} value={link.label}>
						<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
							<YnsLink href={link.href}>{link.label}</YnsLink>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
