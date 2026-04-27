import { CareerSummary as CareerSummaryType } from "@/types";
import styles from "./CareerSummary.module.css";

export default function CareerSummary({ summary }: { summary: CareerSummaryType }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.value}>{summary.total_matches}</span>
          <span className={styles.label}>Matches</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{summary.win_rate}%</span>
          <span className={styles.label}>Win Rate</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{summary.avg_kd}</span>
          <span className={styles.label}>Avg K/D</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{summary.avg_headshot_pct}%</span>
          <span className={styles.label}>Avg HS%</span>
        </div>
      </div>

      {summary.best_map && (
        <div className={styles.bestMap}>
          <span className={styles.label}>Best Map</span>
          <span className={styles.mapName}>{summary.best_map.map}</span>
          <span className={styles.mapRate}>{summary.best_map.win_rate}% WR</span>
        </div>
      )}

      <div className={styles.form}>
        <span className={styles.label}>Current Form</span>
        <div className={styles.formPills}>
          {summary.current_form.map((result, i) => (
            <span
              key={i}
              className={`${styles.pill} ${
                result === "Win"
                  ? styles.win
                  : result === "Loss"
                  ? styles.loss
                  : styles.draw
              }`}
            >
              {result === "Win" ? "W" : result === "Loss" ? "L" : "D"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}