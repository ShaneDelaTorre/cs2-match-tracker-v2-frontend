"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createToken } from "@/lib/endpoints";
import { getErrorMessage } from "@/lib/utils";
import styles from "./page.module.css"

interface FormState {
  error: string | null;
  fields?: {
    username: string
    password: string
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      try {
        const tokens = await createToken({username, password});
        login(tokens.access, tokens.refresh)
        router.push("/dashboard");
        return { error: null };
      } catch (err) {
        return { error: getErrorMessage(err), fields: {username, password} };
      }
    },
    { error: null }
  );

  return (
    <>
      <h1 className={styles.title}>CS2 Tracker</h1>
      <p className={styles.subtitle}>Sign in to your account</p>

      <form action={action} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="leon_kennedy"
            defaultValue={state.fields?.username ?? ""}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={state.fields?.password ?? ""}
            required
          />
        </div>

        {state.error && <p className={styles.error}>{state.error}</p>}

        <button type="submit" disabled={isPending} className={styles.button}>
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className={styles.footer}>
        Don&apos;t have an account? <a href="/register">Register</a>
      </p>
    </>
  );
}