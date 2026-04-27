"use client";

import { useOwnProfile } from "@/hooks/useProfile";
import { useMatches } from "@/hooks/useMatches";
import CareerSummary from "@/components/career_summary/CareerSummary";
import MatchList from "@/components/match_list/MatchList";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useOwnProfile();
  const { data: matches, isLoading: matchesLoading } = useMatches();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Welcome back, {profileLoading ? "..." : profile?.username}
          </h1>
          <p className={styles.rank}>{profile?.rank ?? ""}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Career Summary</h2>
          {profileLoading ? (
            <p className={styles.muted}>Loading stats...</p>
          ) : profile?.career_summary ? (
            <CareerSummary summary={profile.career_summary} />
          ) : (
            <p className={styles.muted}>No matches logged yet.</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Matches</h2>
          {matchesLoading ? (
            <p className={styles.muted}>Loading matches...</p>
          ) : (
            <MatchList matches={matches?.results ?? []} />
          )}
        </section>
      </div>
    </div>
  );
}