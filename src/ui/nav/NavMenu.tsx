"use client";

import * as React from "react";

// TODO https://github.com/radix-ui/primitives/issues/2769

import { useState, type ComponentPropsWithRef, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/ui/shadcn/navigation-menu";
import { YnsLink } from "@/ui/YnsLink";

const links = [
	{
		title: "Features",
		href: "https://yournextstore.com/#features",
		description: "A list of all the features of Your Next Store.",
	},
	{
		title: "Where to buy",
		href: "https://yournextstore.com",
		description: "Join our community and get the latest news about our products.",
	},
];

export function NavMenu() {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<NavigationMenu value={value} onValueChange={setValue}>
			<NavigationMenuList>
				<NavigationMenuItem value="shop">
					<NavigationMenuTriggerWithFixedUX
						onKeyboardOpen={() => setValue((value) => (value === "shop" ? undefined : "shop"))}
					>
						Shop
					</NavigationMenuTriggerWithFixedUX>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<YnsLink
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										href="/"
									>
										<div className="mb-2 mt-4 text-lg font-medium">YNS</div>
										<p className="leading-tight text-muted-foreground">
											Your Next Store is the fastest and most compeling Stripe-powered storefront
										</p>
									</YnsLink>
								</NavigationMenuLink>
							</li>
							<ListItem href="/products" title="All products">
								All products in our store are listed here.
							</ListItem>
							<ListItem href="/category/apparel" title="Apparel">
								All apparel products in our store.
							</ListItem>
							<ListItem href="/category/accessories" title="Accessories">
								All accessories products in our store.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem value="about">
					<NavigationMenuTriggerWithFixedUX
						onKeyboardOpen={() => setValue((value) => (value === "about" ? undefined : "about"))}
					>
						About
					</NavigationMenuTriggerWithFixedUX>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] xl:w-[600px]">
							{links.map((link) => (
								<ListItem key={link.title} title={link.title} href={link.href} target="_blank">
									{link.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem value="documentation">
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<YnsLink href="https://yournextstore.com/docs" target="_blank">
							Documentation
						</YnsLink>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = ({
	className,
	title,
	children,
	href,
	ref,
	...props
}: ComponentPropsWithRef<"a">) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<YnsLink
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
					href={href ?? "#"}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
				</YnsLink>
			</NavigationMenuLink>
		</li>
	);
};

const NavigationMenuTriggerWithFixedUX = ({
	onKeyboardOpen,
	...props
}: React.ComponentProps<typeof NavigationMenuTrigger> & {
	onKeyboardOpen?: (e: KeyboardEvent | PointerEvent) => void;
}) => {
	return (
		<NavigationMenuTrigger
			{...props}
			onClick={(e) => {
				// the menu should open on click on touch screens
				// in some browsers onClick can be triggered by PointerEvent
				if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType !== "mouse") {
					return;
				}
				// prevent the default behavior for mouse users
				e.preventDefault();
			}}
			// the menu should open on click on touch screens
			onPointerDown={(e) => onKeyboardOpen?.(e)}
			onKeyDown={(e) => {
				// reimplement the default behavior for keyboard users
				if (e.key === "Enter" || e.key === " ") {
					return onKeyboardOpen?.(e);
				}
			}}
		/>
	);
};
