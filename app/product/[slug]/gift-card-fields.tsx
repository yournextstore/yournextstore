"use client";

// Platform behaviour for gift card products, not storefront design. The platform reads these four
// line properties and refuses the add with a 400 when one breaks its rules: `recipient_email` an
// email, `recipient_name` up to 255 characters, `message` up to 200, `send_on` local midnight with
// the buyer's offset, from today up to 90 days ahead. Restyle the markup freely; keep the field
// names and what giftCardProperties sends.

import type { APICartCreateBody } from "commerce-kit";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NAME_MAX = 255;
const MESSAGE_MAX = 200;
const SEND_WINDOW_DAYS = 90;

const pad = (value: number) => String(value).padStart(2, "0");

const localDateString = (date: Date) =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const sendOnValue = (day: string) => {
	const midnight = `${day}T00:00:00`;
	const east = -new Date(midnight).getTimezoneOffset();
	const minutes = Math.abs(east);
	return `${midnight}${east < 0 ? "-" : "+"}${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
};

const field = (formData: FormData, name: string) => {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : "";
};

/** The add-to-cart form's gift properties; undefined unless "Send as a gift" is ticked, so the card goes to the buyer. */
export function giftCardProperties(formData: FormData): APICartCreateBody["properties"] {
	if (!formData.has("recipient_email")) return undefined;
	const sendOn = field(formData, "send_on");
	return [
		{ key: "recipient_email", label: "Recipient email", value: field(formData, "recipient_email") },
		{ key: "recipient_name", label: "Recipient name", value: field(formData, "recipient_name") },
		{ key: "message", label: "Message", value: field(formData, "message") },
		{ key: "send_on", label: "Send on", value: sendOn ? sendOnValue(sendOn) : "" },
	]
		.filter(({ value }) => value !== "")
		.map((entry) => ({ ...entry, type: "text" as const }));
}

export function GiftCardFields() {
	const [isGift, setIsGift] = useState(false);

	return (
		<div className="mb-6 space-y-4">
			<Label className="flex cursor-pointer items-center gap-2">
				<Checkbox checked={isGift} onCheckedChange={(value) => setIsGift(value === true)} />
				Send as a gift
			</Label>
			{isGift && <RecipientFields />}
		</div>
	);
}

// Mounted only once the box is ticked, so "today" is the browser's day and never prerendered.
function RecipientFields() {
	const [message, setMessage] = useState("");
	const today = new Date();
	const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + SEND_WINDOW_DAYS);

	return (
		<div className="space-y-4 rounded-2xl border border-border p-4">
			<div className="space-y-1.5">
				<Label htmlFor="gift-recipient-email">Recipient email</Label>
				<Input
					id="gift-recipient-email"
					name="recipient_email"
					type="email"
					required
					autoComplete="off"
					placeholder="friend@example.com"
				/>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="gift-recipient-name">Recipient name (optional)</Label>
				<Input
					id="gift-recipient-name"
					name="recipient_name"
					type="text"
					maxLength={NAME_MAX}
					autoComplete="off"
				/>
			</div>
			<div className="space-y-1.5">
				<div className="flex items-baseline justify-between gap-2">
					<Label htmlFor="gift-message">Message (optional)</Label>
					<span id="gift-message-count" className="text-xs text-muted-foreground">
						{message.length}/{MESSAGE_MAX}
					</span>
				</div>
				<textarea
					id="gift-message"
					name="message"
					rows={3}
					maxLength={MESSAGE_MAX}
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					aria-describedby="gift-message-count"
					className="w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm resize-none"
				/>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="gift-send-on">Send on (optional)</Label>
				<Input
					id="gift-send-on"
					name="send_on"
					type="date"
					min={localDateString(today)}
					max={localDateString(lastDay)}
					aria-describedby="gift-send-on-hint"
				/>
				<p id="gift-send-on-hint" className="text-xs text-muted-foreground">
					Leave empty to send it right away.
				</p>
			</div>
		</div>
	);
}
