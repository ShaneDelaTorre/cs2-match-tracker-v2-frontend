import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import styles from "./layout.module.css";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}