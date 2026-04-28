"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOwnProfile } from "@/hooks/useProfile";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { data: profile } = useOwnProfile();
  const pathname = usePathname();

  const handleLogout = async ()  => {
    await logout();
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.brand}>
          CS2 Tracker
        </Link>

        {isAuthenticated && (
          <>
            <div className={styles.links}>
              <Link
                href="/dashboard"
                className={`${styles.link} ${isActive("/dashboard") ? styles.active : ""}`}
              >
                Dashboard
              </Link>
              <Link
                href="/matches/log"
                className={`${styles.link} ${isActive("/matches/log") ? styles.active : ""}`}
              >
                Log Match
              </Link>
              <Link
                href="/friends"
                className={`${styles.link} ${isActive("/friends") ? styles.active : ""}`}
              >
                Friends
              </Link>
            </div>

            <div className={styles.right}>
              <Link
                href="/profile/me"
                className={styles.username}
              >
                {profile?.username ?? "..."}
              </Link>
              <button onClick={handleLogout} className={styles.logout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}