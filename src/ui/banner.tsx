"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { YnsLink } from "./yns-link";

export const Banner = () => {
	const [isOpen, setIsOpen] = useState(() => localStorage.getItem("banner") !== "true");

	if (!isOpen) return null;

	const handleClose = () => {
		setIsOpen(false);
		localStorage.setItem("banner", "true");
	};

	return (
		<div className="bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 px-4 py-3 text-indigo-900">
			<div className="flex items-center justify-between gap-x-4">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-x-4">
					<div className="flex items-center gap-x-4">
						<p className="text-center text-sm font-medium">
							🎉 Your Next Store adds 3D product previews powered by Spline
						</p>
						<YnsLink
							href="/product/horizon-gaze-sunglasses"
							className="flex-none rounded-full bg-indigo-500 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
						>
							Check it out
						</YnsLink>
					</div>
				</div>
				<button
					onClick={handleClose}
					className="flex-none rounded-full justify-self-end bg-indigo-500 p-1 text-white shadow-sm hover:bg-indigo-600"
					aria-label="Close banner"
					type="button"
				>
					<X size={16} />
				</button>
			</div>
		</div>
	);
};
