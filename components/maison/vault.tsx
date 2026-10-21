"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { removeSaved, type SavedPiece, toggleSaved, useVault } from "@/lib/vault";
import { YNSMedia } from "@/lib/yns-media";
import { DrawerShell } from "./drawer-shell";

/** Heart on a photograph: saves the piece to the private vault in this browser. */
export function HeartPin({
	piece,
	className,
	large = false,
}: {
	piece: SavedPiece;
	className?: string;
	large?: boolean;
}) {
	const vault = useVault();
	const saved = vault.some((item) => item.slug === piece.slug);

	return (
		<button
			type="button"
			aria-pressed={saved}
			aria-label={saved ? `Remove ${piece.name} from the vault` : `Save ${piece.name} to the vault`}
			onClick={() => {
				const added = toggleSaved(piece);
				toast(added ? "Saved to your private vault" : "Removed from the vault");
			}}
			className={cn("pin-btn", saved && "is-on", large && "!size-[42px]", className)}
		>
			<Heart
				aria-hidden
				className={large ? "size-[15px]" : "size-[14px]"}
				strokeWidth={1.5}
				fill={saved ? "currentColor" : "none"}
			/>
		</button>
	);
}

/** "Saved · n" in the masthead, opening the vault drawer. */
export function VaultButton() {
	const vault = useVault();
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger className="flex min-h-6 cursor-pointer items-center gap-1.5 text-soft transition hover:text-acc">
				<Heart
					aria-hidden
					className="size-[13px]"
					strokeWidth={1.5}
					fill={vault.length ? "currentColor" : "none"}
				/>
				<span>
					<span className="hidden sm:inline">Saved · </span>
					<span className="sr-only sm:hidden">Saved </span>
					{vault.length}
				</span>
			</Dialog.Trigger>
			<DrawerShell
				kicker="Saved pieces"
				title="Private vault"
				description="Pieces you saved in this browser."
			>
				{vault.length === 0 ? (
					<p className="py-4 text-[14px] leading-[1.7] text-dim">
						Nothing saved yet. Use the heart on any piece to keep it in your vault.
					</p>
				) : (
					<ul className="flex flex-col">
						{vault.map((piece) => (
							<li key={piece.slug} className="flex items-start gap-[18px] border-t border-line py-4">
								<Link
									href={piece.href}
									onClick={() => setOpen(false)}
									className="hatch relative aspect-[4/5] w-[58px] flex-none overflow-hidden border border-line"
								>
									{piece.image ? (
										<YNSMedia src={piece.image} alt={piece.name} fill sizes="58px" className="object-cover" />
									) : null}
								</Link>
								<div className="flex min-w-0 flex-1 flex-col gap-1.5">
									<Link
										href={piece.href}
										onClick={() => setOpen(false)}
										className="font-sf text-[17px] leading-[1.3] hover:text-acc"
									>
										{piece.name}
									</Link>
									<span className="font-mono text-[11px] text-faint">
										No. {piece.no} · {piece.priceLabel}
									</span>
									<div className="eti flex gap-4">
										<Link href={piece.href} onClick={() => setOpen(false)} className="py-1 text-acc">
											View the record
										</Link>
										<button
											type="button"
											onClick={() => removeSaved(piece.slug)}
											className="cursor-pointer py-1 uppercase text-faint hover:text-acc"
										>
											Remove
										</button>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</DrawerShell>
		</Dialog.Root>
	);
}
