"use client";

import { X } from "lucide-react";
import { useState } from "react";

/** The original's black announcement strip, pointing at the platform account (a plain <a>: proxied zone). */
export function TopBanner({ accountHref }: { accountHref: string }) {
	const [open, setOpen] = useState(true);
	if (!open) return null;

	return (
		<div className="bg-black px-2 py-2 text-center text-white sm:px-4 xl:px-0">
			<div className="relative mx-auto max-w-[77.5rem]">
				<p className="text-xs sm:text-sm">
					Sign up for faster checkout and order tracking.{" "}
					<a href={accountHref} className="font-medium underline underline-offset-2">
						Sign Up Now
					</a>
				</p>
				<button
					type="button"
					onClick={() => setOpen(false)}
					aria-label="Close banner"
					className="absolute top-1/2 right-0 hidden -translate-y-1/2 p-1 sm:flex"
				>
					<X className="size-4" strokeWidth={2.5} />
				</button>
			</div>
		</div>
	);
}
