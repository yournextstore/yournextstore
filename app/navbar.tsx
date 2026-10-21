"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavEntry } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export type NavData = {
	collections: NavEntry[];
	categories: NavEntry[];
	featureImage: string | null;
	accountHref: string;
};

const triggerClass =
	"inline-flex h-10 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent/50";

function ListItem({
	href,
	title,
	children,
	onPick,
}: {
	href: string;
	title: string;
	children: string;
	onPick: () => void;
}) {
	return (
		<li>
			<Link
				href={href}
				onClick={onPick}
				className="block select-none space-y-1 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
			>
				<span className="block text-sm font-medium leading-none">{title}</span>
				<span className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</span>
			</Link>
		</li>
	);
}

function MenuPanel({
	label,
	wide,
	children,
}: {
	label: string;
	wide?: boolean;
	children: (close: () => void) => React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className={triggerClass}>
				{label}
				<ChevronDown
					aria-hidden
					className="relative top-px h-3 w-3 transition duration-200 data-[open=true]:rotate-180"
					data-open={open}
				/>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={6}
				collisionPadding={16}
				className={wide ? "w-[min(600px,calc(100vw-2rem))] p-4" : "w-[min(500px,calc(100vw-2rem))] p-6"}
			>
				{children(() => setOpen(false))}
			</PopoverContent>
		</Popover>
	);
}

/** Desktop menu row: Products · Collections ▾ · Categories ▾ (shadcn navigation-menu look). */
export function MenuItems({ collections, categories, featureImage }: NavData) {
	return (
		<nav aria-label="Main" className="-ml-4 mt-1 flex items-center">
			<Link href="/products" className={triggerClass}>
				Products
			</Link>
			{collections.length > 0 && (
				<MenuPanel label="Collections">
					{(close) => (
						<ul className="grid gap-3 lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-4">
								<Link
									href="/products"
									onClick={close}
									className="relative flex h-full min-h-48 w-full select-none flex-col justify-end overflow-hidden rounded-md border border-border bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									{featureImage && (
										<YNSMedia src={featureImage} alt="" fill sizes="200px" className="object-cover" />
									)}
									<span className="relative m-2 rounded-md bg-background/95 p-4">
										<span className="block text-lg font-medium">Shop everything</span>
										<span className="block text-sm leading-tight text-muted-foreground">
											The whole catalogue in one place
										</span>
									</span>
								</Link>
							</li>
							{collections.slice(0, 4).map((c) => (
								<ListItem key={c.slug} href={`/collection/${c.slug}`} title={c.name} onPick={close}>
									{c.description}
								</ListItem>
							))}
						</ul>
					)}
				</MenuPanel>
			)}
			{(categories.length > 0 || collections.length > 4) && (
				<MenuPanel label={categories.length > 0 ? "Departments" : "More collections"} wide>
					{(close) => (
						<ul className="grid gap-3 md:grid-cols-2">
							{(categories.length > 0 ? categories : collections.slice(4, 12)).map((c) => (
								<ListItem
									key={c.slug}
									href={categories.length > 0 ? `/category/${c.slug}` : `/collection/${c.slug}`}
									title={c.name}
									onPick={close}
								>
									{c.description}
								</ListItem>
							))}
						</ul>
					)}
				</MenuPanel>
			)}
		</nav>
	);
}

function MobileRow({
	href,
	name,
	image,
	onPick,
	external,
}: {
	href: string;
	name: string;
	image: string | null;
	onPick: () => void;
	external?: boolean;
}) {
	const inner = (
		<>
			<span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-l-md bg-secondary">
				{image && <YNSMedia src={image} alt="" fill sizes="56px" className="object-cover" />}
			</span>
			<span className="w-full px-4 text-left text-sm font-medium text-primary underline-offset-4 group-hover:underline">
				{name}
			</span>
		</>
	);
	const className = "group flex w-full items-center gap-2 rounded-md border border-border";
	// /account is a proxied zone: plain <a>, never a soft navigation.
	return external ? (
		<a href={href} className={className}>
			{inner}
		</a>
	) : (
		<Link href={href} onClick={onPick} className={className}>
			{inner}
		</Link>
	);
}

/** Mobile/tablet menu: a bordered menu button opening a sheet with search and pictured links. */
export function MobileNavigation({ collections, categories, featureImage, accountHref }: NavData) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="rounded-md border border-border p-2 transition-colors hover:bg-accent"
				>
					<Menu aria-hidden className="h-6 w-6" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				aria-describedby={undefined}
				className="block w-full overflow-y-auto p-6 sm:max-w-[400px] lg:max-w-[600px]"
			>
				<SheetHeader className="p-0">
					<SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
				</SheetHeader>
				<div className="my-6">
					<MobileSearchInput onNavigate={close} />
				</div>
				<div className="flex flex-col items-start gap-2">
					<MobileRow href="/products" name="Products" image={featureImage} onPick={close} />
					{categories.map((c) => (
						<MobileRow
							key={c.slug}
							href={`/category/${c.slug}`}
							name={c.name}
							image={c.image}
							onPick={close}
						/>
					))}
					<MobileRow
						href={accountHref}
						name="Account"
						image={collections[1]?.image ?? null}
						onPick={close}
						external
					/>
				</div>
				{collections.length > 0 && (
					<>
						<p className="mt-8 mb-2 text-sm font-semibold">Collections</p>
						<ul className="flex flex-col">
							{collections.map((c) => (
								<li key={c.slug}>
									<Link
										href={`/collection/${c.slug}`}
										onClick={close}
										className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
									>
										{c.name}
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
