"use client";

import { useParams } from "next/navigation";
import { usePublicProfile } from "@/hooks/useProfile";
import { useSendFriendRequest } from "@/hooks/useFriends";
import { getErrorMessage } from "@/lib/utils";
import CareerSummary from "@/components/career_summary/CareerSummary";
import styles from "./page.module.css";
import { useState } from "react";

export default function PublicProfilePage() {
  const { id } = useParams();
  const { data: profile, isLoading } = usePublicProfile(Number(id));
  const { mutateAsync: sendRequest, isPending } = useSendFriendRequest();
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFriend = async () => {
    try {
      await sendRequest(Number(id));
      setRequestSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) return <p className={styles.muted}>Loading profile...</p>;
  if (!profile) return <p className={styles.muted}>User not found.</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {profile.username[0].toUpperCase()}
        </div>
        <div className={styles.info}>
          <h1 className={styles.username}>{profile.username}</h1>
          <p className={styles.rank}>{profile.rank}</p>
          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
        </div>
        <div className={styles.actions}>
          {profile.are_friends ? (
            <span className={styles.friendBadge}>Friends</span>
          ) : requestSent ? (
            <span className={styles.pendingBadge}>Request Sent</span>
          ) : (
            <button
              onClick={handleAddFriend}
              disabled={isPending}
              className={styles.addButton}
            >
              {isPending ? "Sending..." : "Add Friend"}
            </button>
          )}
          {error && <p className={styles.error}>{error}</p>}
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