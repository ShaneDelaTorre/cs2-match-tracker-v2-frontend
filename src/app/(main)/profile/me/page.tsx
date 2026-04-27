"use client";

import { useOwnProfile } from "@/hooks/useProfile";
import CareerSummary from "@/components/career_summary/CareerSummary";
import styles from "./page.module.css";

export default function OwnProfilePage() {
  const { data: profile, isLoading } = useOwnProfile();

  if (isLoading) return <p className={styles.muted}>Loading profile...</p>;
  if (!profile) return <p className={styles.muted}>Profile not found.</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {profile.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className={styles.username}>{profile.username}</h1>
          <p className={styles.rank}>{profile.rank}</p>
          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Career Summary</h2>
        {profile.career_summary ? (
          <CareerSummary summary={profile.career_summary} />
        ) : (
          <p className={styles.muted}>No matches logged yet.</p>
        )}
      </section>
    </div>
  );
}