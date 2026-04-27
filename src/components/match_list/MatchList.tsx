import Link from "next/link";
import { Match } from "@/types";
import styles from "./MatchList.module.css";

export default function MatchList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <p className={styles.empty}>No matches logged yet.</p>;
  }

  return (
    <div className={styles.list}>
      {matches.map((match) => (
        <Link
          key={match.id}
          href={`/matches/${match.id}`}
          className={styles.item}
        >
          <div className={styles.left}>
            <span
              className={`${styles.result} ${
                match.result === "Win"
                  ? styles.win
                  : match.result === "Loss"
                  ? styles.loss
                  : styles.draw
              }`}
            >
              {match.result[0]}
            </span>
            <div>
              <p className={styles.map}>{match.map.name}</p>
              <p className={styles.mode}>{match.game_mode}</p>
            </div>
          </div>

          <div className={styles.right}>
            <p className={styles.score}>
              {match.team_score} — {match.opponent_score}
            </p>
            <p className={styles.kd}>
              {match.stat?.kd_ratio ?? "-"} K/D
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}