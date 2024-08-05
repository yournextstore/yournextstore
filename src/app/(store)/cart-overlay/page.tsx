import { redirect } from "next/navigation";

// This page is rendered on full reload
// We want to redirect to `/cart` to avoid conflict of the routes
export default function RedirectToCart() {
	redirect("/cart");
}
