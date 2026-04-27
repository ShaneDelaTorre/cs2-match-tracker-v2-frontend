"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/endpoints";
import { getErrorMessage } from "@/lib/utils";
import styles from "./page.module.css";

interface FormState {
  error: string | null;
  fields?: {
    username: string
    email: string
    password: string
    re_password: string
  }
}


export default function RegisterPage() {
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const username = formData.get("username") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const re_password = formData.get("re_password") as string;

      if (password !== re_password) {
        return { error: "Passwords do not match.", fields: {username, email, password, re_password} };
      }

      try {
        await registerUser({username, email, password, re_password})
        router.push("/login");
        return { error: null };
      } catch (err) {
        return { error: getErrorMessage(err), fields: {username, email, password, re_password}};
      }

    },
    { error: null }
  );

  return (
    <>
      <h1 className={styles.title}>Create Account</h1>
      <p className={styles.subtitle}>Start tracking your matches</p>

      <form action={action} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" placeholder="leon_kennedy" defaultValue={state.fields?.username} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="leon@gmail.com" defaultValue={state.fields?.email ?? ""} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" defaultValue={state.fields?.password ?? ""} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="re_password">Confirm Password</label>
          <input id="re_password" name="re_password" type="password" defaultValue={state.fields?.re_password ?? ""} required />
        </div>

        {state.error && <p className={styles.error}>{state.error}</p>}

        <button type="submit" disabled={isPending} className={styles.button}>
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </>
  );
}