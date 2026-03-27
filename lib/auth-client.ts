"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;
