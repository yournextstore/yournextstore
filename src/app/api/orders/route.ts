import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16", // use your actual Stripe API version
});

export async function GET() {
    try {
        const payments = await stripe.paymentIntents.list({
            limit: 100, // adjust as needed
        });

        const orders = payments.data.map((p) => ({
            id: p.id,
            customer: p.metadata.customer_name || "Unknown",
            date: new Date(p.created * 1000).toISOString().split("T")[0],
            total: (p.amount_received || p.amount) / 100,
            status: p.status,
        }));

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Failed to fetch Stripe payments:", error);
        return new NextResponse("Error fetching payments", { status: 500 });
    }
}
