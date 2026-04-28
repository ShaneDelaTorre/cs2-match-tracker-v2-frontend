import "./globals.css";
import { cookies } from "next/headers";
import Providers from "./providers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const isAuthenticated = !!token;

  return (
    <html lang="en">
      <body>
        <Providers initialAuth = {isAuthenticated}>{children}</Providers>
      </body>
    </html>
  );
}
