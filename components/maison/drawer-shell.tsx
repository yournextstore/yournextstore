"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

/**
 * The printed side drawer (bag, vault): paper panel with a hairline edge, mono kicker,
 * "Close ✕" and a serif title. Render inside a Dialog.Root.
 */
export function DrawerShell({
	kicker,
	title,
	description,
	children,
}: {
	kicker: string;
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<Dialog.Portal>
			<Dialog.Backdrop className="fixed inset-0 z-50 bg-[oklch(0.22_0.006_0/0.42)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
			<Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-[min(480px,100%)] flex-col gap-[22px] overflow-y-auto border-l border-rule bg-paper p-[clamp(20px,4vw,36px)] outline-none data-open:animate-in data-open:slide-in-from-right-6 data-open:fade-in-60 data-closed:animate-out data-closed:fade-out-0">
				<div className="flex shrink-0 items-baseline gap-4">
					<span className="eti text-faint">{kicker}</span>
					<span className="flex-1" />
					<Dialog.Close className="flex min-h-6 cursor-pointer items-center gap-1.5 font-mono text-[12px] text-soft transition hover:text-acc">
						Close <X aria-hidden className="size-3.5" strokeWidth={1.5} />
					</Dialog.Close>
				</div>
				<Dialog.Title className="font-sf shrink-0 text-[26px] font-normal">{title}</Dialog.Title>
				<Dialog.Description className="sr-only">{description}</Dialog.Description>
				{children}
			</Dialog.Popup>
		</Dialog.Portal>
	);
}
