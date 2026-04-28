"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/AuthContext";
import { makeQueryClient } from "@/lib/queryClient";
import { useState } from "react";

export default function Providers({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth: boolean;
}) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialAuth={initialAuth}>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}