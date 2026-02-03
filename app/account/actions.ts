"use server";

import { cookies } from "next/headers";

export async function login(email: string, password: string) {
	// This is a demo implementation
	// In production, validate against your auth provider/database
	if (!email || !password) {
		return { success: false, error: "Email and password are required" };
	}

	// Demo: Accept any email/password combination
	const name = email.split("@")[0];

	const cookieStore = await cookies();
	cookieStore.set("user", JSON.stringify({ email, name }), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});

	return { success: true };
}

export async function register(name: string, email: string, password: string) {
	// This is a demo implementation
	// In production, create user in your database
	if (!name || !email || !password) {
		return { success: false, error: "All fields are required" };
	}

	if (password.length < 6) {
		return { success: false, error: "Password must be at least 6 characters" };
	}

	const cookieStore = await cookies();
	cookieStore.set("user", JSON.stringify({ email, name }), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});

	return { success: true };
}

export async function logout() {
	const cookieStore = await cookies();
	cookieStore.delete("user");
	return { success: true };
}

export async function getUser() {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get("user");
	if (!userCookie?.value) return null;

	try {
		return JSON.parse(userCookie.value) as { email: string; name: string };
	} catch {
		return null;
	}
}
