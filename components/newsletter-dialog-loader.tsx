"use client";

import dynamic from "next/dynamic";

/** The popup opens after a delay, so its code loads after the page instead of with it. */
export const NewsletterDialogLoader = dynamic(
	() => import("@/components/newsletter-dialog").then((module) => module.NewsletterDialog),
	{ ssr: false },
);
