import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.code}>404</h2>
      <p className={styles.title}>Page not found</p>
      <p className={styles.message}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a href="/dashboard" className={styles.link}>
        Go to Dashboard
      </a>
    </div>
  );
}