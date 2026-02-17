"use client";

import { useEffect, useState } from "react";
import { YnsLink } from "@/components/yns-link";

const announcements = [
	{ text: "Sign up for 10% off your first order.", link: "/", linkText: "Sign Up" },
	{ text: "Summer sale discount off 50%.", link: "/", linkText: "Shop Sale" },
	{ text: "Free shipping on orders over $500.", link: "/", linkText: "Shop Now" },
];

export function AnnouncementBar() {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % announcements.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-foreground text-primary-foreground text-xs sm:text-sm py-2.5 relative overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
				{announcements.map((announcement, index) => (
					<div
						key={announcement.text}
						className="transition-all duration-500"
						style={{
							display: index === current ? "block" : "none",
						}}
					>
						<span>{announcement.text}</span>{" "}
						<YnsLink
							prefetch={"eager"}
							href={announcement.link}
							className="underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity"
						>
							{announcement.linkText}
						</YnsLink>
					</div>
				))}
			</div>
		</div>
	);
}
