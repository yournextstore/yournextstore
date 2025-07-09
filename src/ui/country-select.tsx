"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/components/ui/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countries, findMatchingCountry } from "@/lib/countries";
import { ElWithErrors, type ElWithErrorsProps } from "@/ui/input-errors";

type ListItem = (typeof countries)[number];

export function CountrySelect({
	value,
	onChangeValue,
	...props
}: ElWithErrorsProps & { onChangeValue?: (value: string) => void }) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const selectedCountry = findMatchingCountry(value) ?? null;

	return (
		<ElWithErrors {...props}>
			{(_innerProps) => {
				if (isDesktop) {
					return (
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button variant="outline" className="mt-3 w-full justify-between text-base">
									{selectedCountry ? <>{selectedCountry.label}</> : "Select country…"}
									<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0" align="start">
								<CountryList setOpen={setOpen} setSelectedCountry={(c) => onChangeValue?.(c?.value ?? "")} />
							</PopoverContent>
						</Popover>
					);
				}

				return (
					<Drawer open={open} onOpenChange={setOpen}>
						<DrawerTrigger asChild>
							<Button variant="outline" className="w-[150px] justify-start">
								{selectedCountry ? <>{selectedCountry.label}</> : <>+ Set status</>}
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<div className="mt-4 border-t">
								<CountryList setOpen={setOpen} setSelectedCountry={(c) => onChangeValue?.(c?.value ?? "")} />
							</div>
						</DrawerContent>
					</Drawer>
				);
			}}
		</ElWithErrors>
	);
}

function CountryList({
	setOpen,
	setSelectedCountry,
}: {
	setOpen: (open: boolean) => void;
	setSelectedCountry: (country: ListItem | null) => void;
}) {
	return (
		<Command
			filter={(value, search) => {
				const country = findMatchingCountry(value);
				return country?.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
			}}
		>
			<CommandInput
				placeholder="Find country…"
				className="my-2 h-8 border border-neutral-200 py-0 focus:border-neutral-300 focus:outline-hidden focus:ring-3 focus:ring-neutral-100"
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{countries.map((country) => (
						<CommandItem
							key={country.value}
							value={country.value}
							onChange={(e) => {
								e.stopPropagation();
							}}
							onSelect={(value) => {
								setSelectedCountry(findMatchingCountry(value) ?? null);
								setOpen(false);
							}}
						>
							{country.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
