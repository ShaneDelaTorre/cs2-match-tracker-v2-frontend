"use client";
import { useNews } from "@/hooks/useNews";
import styles from "./page.module.css";

export default function NewsPage() {
  const { data, isLoading } = useNews();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) return <p className={styles.loading}>Loading news...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>CS2 Activity Feed</h1>
        <p className={styles.subtitle}>
          Latest news and updates from the CS2 universe
        </p>
      </div>

      <div className={styles.list}>
        {data?.results.length === 0 ? (
          <p className={styles.empty}>No news yet. Check back soon.</p>
        ) : (
          data?.results.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <span className={styles.source}>{item.source_name}</span>
                <span className={styles.date}>
                  {formatDate(item.published_at)}
                </span>
              </div>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <span className={styles.readMore}>Read article →</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}