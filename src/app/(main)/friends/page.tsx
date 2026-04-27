"use client";

import { useFriends, useFriendRequests, useRespondToFriendRequest } from "@/hooks/useFriends";
import Link from "next/link";
import styles from "./page.module.css";

export default function FriendsPage() {
  const { data: friends, isLoading: friendsLoading } = useFriends();
  const { data: requests, isLoading: requestsLoading } = useFriendRequests();
  const { mutate: respond, isPending } = useRespondToFriendRequest();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Friends</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Pending Requests ({requests?.length ?? 0})
        </h2>
        {requestsLoading ? (
          <p className={styles.muted}>Loading...</p>
        ) : requests?.length === 0 ? (
          <p className={styles.muted}>No pending requests.</p>
        ) : (
          <div className={styles.list}>
            {requests?.map((fr) => (
              <div key={fr.id} className={styles.requestItem}>
                <Link
                  href={`/profile/${fr.sender.id}`}
                  className={styles.username}
                >
                  {fr.sender.username}
                </Link>
                <div className={styles.requestActions}>
                  <button
                    onClick={() => respond({ id: fr.id, accepting: true })}
                    disabled={isPending}
                    className={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond({ id: fr.id, accepting: false })}
                    disabled={isPending}
                    className={styles.rejectButton}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Your Friends ({friends?.length ?? 0})
        </h2>
        {friendsLoading ? (
          <p className={styles.muted}>Loading...</p>
        ) : friends?.length === 0 ? (
          <p className={styles.muted}>No friends yet.</p>
        ) : (
          <div className={styles.list}>
            {friends?.map((friend) => (
              <Link
                key={friend.id}
                href={`/profile/${friend.id}`}
                className={styles.friendItem}
              >
                <div className={styles.avatar}>
                  {friend.username[0].toUpperCase()}
                </div>
                <div>
                  <p className={styles.friendName}>{friend.username}</p>
                  <p className={styles.friendRank}>{friend.rank}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}