"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon, BarsIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavCategory, ShowcaseTile } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export type NavData = {
	categories: NavCategory[];
	collections: ShowcaseTile[];
	blogEnabled: boolean;
};

const navItem =
	"flex h-full items-center border-b border-transparent px-2 text-lead transition-colors group-hover/menu:border-foreground group-focus-within/menu:border-foreground";
const panel =
	"invisible absolute inset-x-0 top-full z-50 bg-background opacity-0 shadow-lg transition-[opacity,visibility] duration-300 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100";

/** Shop / Collections / About Us with the original's hover mega menus (900px and up). */
export function DesktopNav({ data }: { data: NavData }) {
	return (
		<nav aria-label="Main" className="hidden gap-4 self-stretch large:flex">
			<div className="group/menu flex">
				<Link href="/products" className={navItem}>
					Shop
				</Link>
				{data.categories.length > 0 && (
					<div className={panel}>
						<div className="shell flex flex-col gap-6 pt-5 pb-8">
							<Link href="/products" className="pill pill-tonal w-max [--pill-h:2.5rem] [--pill-px:0.75rem]">
								Shop all
							</Link>
							<div className="grid grid-cols-4 gap-8">
								{data.categories.map((category) => (
									<div key={category.id} className="flex flex-col gap-2">
										<Link
											href={category.href}
											className="w-max border-b border-transparent py-2 text-lead hover:border-foreground"
										>
											{category.name}
										</Link>
										{category.children.length > 0 && (
											<div className="flex flex-col">
												{category.children.map((child) => (
													<Link
														key={child.id}
														href={child.href}
														className="w-max py-1.5 text-copy text-muted-foreground hover:text-foreground"
													>
														{child.name}
													</Link>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
			{data.collections.length > 0 && (
				<div className="group/menu flex">
					<Link href={data.collections[0]?.href ?? "/products"} className={navItem}>
						Collections
					</Link>
					<div className={panel}>
						<div className="shell grid grid-cols-3 gap-2 pt-5 pb-8">
							{data.collections.slice(0, 3).map((tile) => (
								<Link key={tile.id} href={tile.href} className="group/tile relative block h-[17.625rem]">
									{tile.image && (
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes="(min-width: 1440px) 440px, 33vw"
											className="object-cover"
										/>
									)}
									<span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
									<span className="absolute inset-0 flex flex-col p-10">
										<span className="pill pill-white self-end">Discover</span>
										<span className="mt-auto text-heading-md text-white">{tile.name}</span>
										{tile.description && (
											<span className="line-clamp-2 text-lead text-white">{tile.description}</span>
										)}
									</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
			<div className="group/menu flex">
				<Link href="/about" className={navItem}>
					About Us
				</Link>
			</div>
		</nav>
	);
}

type Level = { kind: "root" } | { kind: "collections" } | { kind: "category"; category: NavCategory };

const row =
	"flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-copy transition-colors hover:bg-hover";

/** Below 900px: the original's full-width "Menu" drawer with drill-down levels. */
export function MobileMenu({ data }: { data: NavData }) {
	const [open, setOpen] = useState(false);
	const [level, setLevel] = useState<Level>({ kind: "root" });

	const close = () => {
		setOpen(false);
		setLevel({ kind: "root" });
	};

	const back = (
		<button type="button" onClick={() => setLevel({ kind: "root" })} className={`${row} justify-start gap-3`}>
			<ArrowLeftIcon className="size-5" />
			Back
		</button>
	);

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) setLevel({ kind: "root" });
			}}
		>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-hover xs:size-12 large:hidden"
			>
				<BarsIcon className="size-5" />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="gap-0 p-0 shadow-none data-[side=left]:w-full data-[side=left]:border-r-0 data-[side=left]:sm:max-w-full data-[side=left]:md:max-w-[25rem] data-[side=left]:md:border-r"
			>
				<div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border px-4">
					<SheetTitle className="text-heading-xs font-normal">
						{level.kind === "root"
							? "Menu"
							: level.kind === "collections"
								? "Collections"
								: level.category.name}
					</SheetTitle>
					<SheetDescription className="sr-only">Store navigation</SheetDescription>
					<button
						type="button"
						onClick={close}
						aria-label="Close menu"
						className="inline-flex size-12 items-center justify-center rounded-full hover:bg-hover"
					>
						<CloseIcon className="size-5" />
					</button>
				</div>
				<nav aria-label="Main" className="flex flex-col overflow-y-auto px-4 py-4">
					{level.kind === "root" && (
						<>
							<Link
								href="/products"
								onClick={close}
								className="pill pill-tonal mb-3 w-max [--pill-h:2.5rem] [--pill-px:1rem]"
							>
								Shop all
							</Link>
							{data.categories.map((category) =>
								category.children.length > 0 ? (
									<button
										key={category.id}
										type="button"
										onClick={() => setLevel({ kind: "category", category })}
										className={row}
									>
										{category.name}
										<ChevronRightIcon className="size-5" />
									</button>
								) : (
									<Link key={category.id} href={category.href} onClick={close} className={row}>
										{category.name}
										<ChevronRightIcon className="size-5" />
									</Link>
								),
							)}
							<hr className="-mx-4 my-4 border-border" />
							{data.collections.length > 0 && (
								<button type="button" onClick={() => setLevel({ kind: "collections" })} className={row}>
									Collections
									<ChevronRightIcon className="size-5" />
								</button>
							)}
							<Link href="/about" onClick={close} className={row}>
								About Us
							</Link>
							{data.blogEnabled && (
								<Link href="/blog" onClick={close} className={row}>
									Blog
								</Link>
							)}
							<Link href="/faq" onClick={close} className={row}>
								FAQ
							</Link>
						</>
					)}
					{level.kind === "collections" && (
						<>
							{back}
							<div className="mt-2 flex flex-col gap-2">
								{data.collections.map((tile) => (
									<Link key={tile.id} href={tile.href} onClick={close} className="relative block h-40">
										{tile.image && (
											<YNSMedia src={tile.image} alt="" fill sizes="100vw" className="object-cover" />
										)}
										<span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
										<span className="absolute bottom-6 left-6 text-heading-sm text-white">{tile.name}</span>
									</Link>
								))}
							</div>
						</>
					)}
					{level.kind === "category" && (
						<>
							{back}
							<Link href={level.category.href} onClick={close} className={row}>
								Shop all {level.category.name}
							</Link>
							{level.category.children.map((child) => (
								<Link key={child.id} href={child.href} onClick={close} className={row}>
									{child.name}
								</Link>
							))}
						</>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
