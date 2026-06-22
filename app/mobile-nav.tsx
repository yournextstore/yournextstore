"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";

type MobileNavProps = {
	links: {
		href: string;
		label: string;
	}[];
};

export function MobileNav({ links }: MobileNavProps) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="flex h-10 w-10 items-center justify-center border border-border/80 bg-background transition-colors hover:bg-[var(--surface-soft)] lg:hidden"
					aria-label="Open navigation"
				>
					<Menu className="h-[1.125rem] w-[1.125rem]" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="w-full border-r border-border/80 bg-background px-0 sm:max-w-md">
				<SheetHeader className="border-b border-border/80 px-6 py-5">
					<SheetTitle className="font-editorial text-3xl tracking-[-0.04em]">Vela</SheetTitle>
					<SheetDescription className="max-w-xs text-sm leading-6 text-muted-foreground">
						Browse curated furniture, lighting, and objects arranged for calm, tactile rooms.
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col justify-between px-6 py-8">
					<nav className="space-y-5">
						<SheetClose asChild>
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="block text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
							>
								Home
							</YnsLink>
						</SheetClose>
						{links.map((link) => (
							<SheetClose asChild key={link.href}>
								<YnsLink
									prefetch={"eager"}
									href={link.href}
									className="block font-editorial text-[1.9rem] leading-none tracking-[-0.04em] text-foreground"
								>
									{link.label}
								</YnsLink>
							</SheetClose>
						))}
						<SheetClose asChild>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="block text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
							>
								Client services
							</YnsLink>
						</SheetClose>
					</nav>

					<div className="space-y-4 border-t border-border/80 pt-6 text-sm text-muted-foreground">
						<p>Complimentary delivery on orders over $300.</p>
						<p>Material-led furniture selected from independent studios.</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
