import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
	title: "Create an account",
};

export default function SignupPage() {
	return <SignupForm />;
}
