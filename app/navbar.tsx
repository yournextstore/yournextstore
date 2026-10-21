"use client";

import { ChevronDownIcon, LayoutGridIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export type DepartmentLink = NavLink & { child: boolean };

/** Desktop "All Departments" dropdown: the store's categories, sub-categories indented. */
export function DepartmentsMenu({ departments }: { departments: DepartmentLink[] }) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="fc-btn fc-btn-green mr-4">
				<LayoutGridIcon className="size-4" aria-hidden />
				All Departments
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" sideOffset={6} className="min-w-[14rem] rounded-md p-1.5 shadow-lg">
				<DropdownMenuItem
					asChild
					className="rounded px-3 py-1.5 text-fc-base text-gray-800 focus:bg-gray-200"
				>
					<Link href="/products">All products</Link>
				</DropdownMenuItem>
				{departments.map((department) => (
					<DropdownMenuItem
						key={department.href}
						asChild
						className={cn(
							"rounded px-3 py-1.5 text-fc-base text-gray-800 focus:bg-gray-200",
							department.child && "pl-6 text-gray-600",
						)}
					>
						<Link href={department.href}>{department.label}</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/** The offcanvas menu below lg: wordmark and close, search, the departments toggle, then the nav list. */
export function MobileMenu({
	links,
	departments,
	storeName,
}: {
	links: NavLink[];
	departments: DepartmentLink[];
	storeName: string;
}) {
	const [open, setOpen] = useState(false);
	const [departmentsOpen, setDepartmentsOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-m-2 inline-flex p-2 text-gray-800 transition hover:text-green-600 lg:hidden"
				>
					<MenuIcon className="size-6" strokeWidth={1.75} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				className="block w-[85vw] max-w-sm gap-0 overflow-y-auto border-r-0 p-0"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex items-center justify-between px-4 pt-4 pb-1">
					<Logo name={storeName} onClick={() => setOpen(false)} />
					<SheetClose
						className="-m-2 p-2 text-gray-700 transition hover:text-gray-900"
						aria-label="Close menu"
					>
						<XIcon className="size-6" />
					</SheetClose>
				</div>
				<div className="p-4">
					<div className="mb-4">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<div className="mb-4">
						<button
							type="button"
							aria-expanded={departmentsOpen}
							onClick={() => setDepartmentsOpen((value) => !value)}
							className="fc-btn fc-btn-green"
						>
							<LayoutGridIcon className="size-4" aria-hidden />
							All Departments
							<ChevronDownIcon
								className={cn("size-4 transition", departmentsOpen && "rotate-180")}
								aria-hidden
							/>
						</button>
						{departmentsOpen ? (
							<ul className="fc-card mt-2 p-2">
								<li>
									<Link
										href="/products"
										onClick={() => setOpen(false)}
										className="flex rounded px-3 py-2 text-gray-800 hover:bg-gray-200"
									>
										All products
									</Link>
								</li>
								{departments.map((department) => (
									<li key={department.href}>
										<Link
											href={department.href}
											onClick={() => setOpen(false)}
											className={cn(
												"flex rounded px-3 py-2 text-gray-800 hover:bg-gray-200",
												department.child && "pl-6 text-gray-600",
											)}
										>
											{department.label}
										</Link>
									</li>
								))}
							</ul>
						) : null}
					</div>
					<nav aria-label="Main">
						<ul>
							{links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										onClick={() => setOpen(false)}
										className="flex border-b border-gray-300 px-2 py-2 leading-[1.8] font-medium text-gray-800 transition hover:text-green-600"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
}
