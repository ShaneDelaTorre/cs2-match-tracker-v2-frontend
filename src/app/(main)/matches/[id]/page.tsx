"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMatch, useMatchStateAtRound } from "@/hooks/useMatches";
import styles from "./page.module.css";

export default function MatchDetailPage() {
  const { id } = useParams();
  const matchId = Number(id);
  const [roundN, setRoundN] = useState(0);

  const { data: match, isLoading } = useMatch(matchId);
  const { data: stateAtRound } = useMatchStateAtRound(matchId, roundN);

  if (isLoading) return <p className={styles.muted}>Loading match...</p>;
  if (!match) return <p className={styles.muted}>Match not found.</p>;

  const totalRounds = match.rounds.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{match.map.name}</h1>
          <p className={styles.meta}>
            {match.game_mode} · {match.duration} min ·{" "}
            {new Date(match.played_at).toLocaleDateString()}
          </p>
        </div>
        <div className={styles.result}>
          <span
            className={`${styles.resultBadge} ${
              match.result === "Win"
                ? styles.win
                : match.result === "Loss"
                ? styles.loss
                : styles.draw
            }`}
          >
            {match.result}
          </span>
          <span className={styles.score}>
            {match.team_score} — {match.opponent_score}
          </span>
        </div>
      </div>

      {match.stat && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Match Stats</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{match.stat.kills}</span>
              <span className={styles.statLabel}>Kills</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{match.stat.deaths}</span>
              <span className={styles.statLabel}>Deaths</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{match.stat.assists}</span>
              <span className={styles.statLabel}>Assists</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{match.stat.kd_ratio}</span>
              <span className={styles.statLabel}>K/D</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {match.stat.headshot_percentage}%
              </span>
              <span className={styles.statLabel}>HS%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{match.stat.mvp_rounds}</span>
              <span className={styles.statLabel}>MVPs</span>
            </div>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>State at Round</h2>
        <p className={styles.hint}>
          Drag the slider to see the match state at any round — this is the
          event sourcing query live.
        </p>

        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min={0}
            max={totalRounds}
            value={roundN}
            onChange={(e) => setRoundN(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderLabel}>
            {roundN === 0 ? "Select a round" : `Round ${roundN}`}
          </span>
        </div>

        {roundN > 0 && stateAtRound && (
          <div className={styles.stateGrid}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stateAtRound.team_score}</span>
              <span className={styles.statLabel}>Team Score</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stateAtRound.opponent_score}</span>
              <span className={styles.statLabel}>Opponent Score</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stateAtRound.kills}</span>
              <span className={styles.statLabel}>Kills</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stateAtRound.headshots}</span>
              <span className={styles.statLabel}>Headshots</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stateAtRound.deaths}</span>
              <span className={styles.statLabel}>Deaths</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stateAtRound.mvps}</span>
              <span className={styles.statLabel}>MVPs</span>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Round by Round</h2>
        <div className={styles.rounds}>
          {match.rounds.map((round) => (
            <div
              key={round.id}
              className={`${styles.round} ${
                round.round_result === "Win" ? styles.roundWin : styles.roundLoss
              }`}
            >
              <span className={styles.roundNum}>R{round.round_number}</span>
              <span className={styles.roundResult}>{round.round_result}</span>
              <span className={styles.roundStat}>{round.kills}K</span>
              <span className={styles.roundStat}>{round.headshots}HS</span>
              {round.survived && (
                <span className={styles.roundBadge}>Survived</span>
              )}
              {round.mvp && (
                <span className={`${styles.roundBadge} ${styles.mvp}`}>MVP</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}