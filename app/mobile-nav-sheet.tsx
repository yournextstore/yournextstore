"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";

type Collection = { id: string; slug: string; name: string };

export function MobileNavSheet({ collections }: { collections: readonly Collection[] }) {
	const [open, setOpen] = useState(false);

	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="rounded-full p-2 transition-colors hover:bg-secondary sm:hidden"
			>
				<Menu className="h-6 w-6" />
			</SheetTrigger>
			<SheetContent side="bottom" className="rounded-t-2xl pb-6">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col px-4 pb-2">
					<YnsLink
						prefetch={"eager"}
						href="/"
						onClick={close}
						className="border-b border-border py-3 text-base font-medium text-foreground"
					>
						Home
					</YnsLink>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						onClick={close}
						className="border-b border-border py-3 text-base font-medium text-foreground"
					>
						Products
					</YnsLink>
					{collections.length > 0 ? (
						<>
							<span className="pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
								Collections
							</span>
							{collections.map((collection) => (
								<YnsLink
									prefetch={"eager"}
									key={collection.id}
									href={`/collection/${collection.slug}`}
									onClick={close}
									className="border-b border-border py-3 text-base text-foreground"
								>
									{collection.name}
								</YnsLink>
							))}
						</>
					) : null}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
