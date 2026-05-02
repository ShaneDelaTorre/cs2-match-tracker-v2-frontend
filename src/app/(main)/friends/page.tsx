"use client";

import {
  useFriends,
  useAccountSearch,
  useFriendRequests,
  useRespondToFriendRequest,
} from "@/hooks/useFriends";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";

export default function FriendsPage() {
  const [query, setQuery] = useState("");

  const { data: friends, isLoading: friendsLoading } = useFriends();
  const { data: searchResults, isLoading: searchLoading } = useAccountSearch(query);
  const { data: requests, isLoading: requestsLoading } = useFriendRequests();
  const { mutate: respond, isPending } = useRespondToFriendRequest();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Friends</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Find Players</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search username..."
          className={styles.searchInput}
        />
        {query.length > 0 && (
          <div className={styles.list}>
            {searchResults?.results.length === 0 ? (
              <p className={styles.muted}>No users found.</p>
            ) : (
              searchResults?.results.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className={styles.searchItem}
                >
                  <div className={styles.avatar}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.rankBadge}>{user.rank}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </section>

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
              <div key={friend.id} className={styles.friendItem}>
                <div className={styles.avatar}>
                  {friend.username[0].toUpperCase()}
                </div>
                <div className={styles.friendInfo}>
                  <p className={styles.friendName}>{friend.username}</p>
                  <p className={styles.friendRank}>{friend.rank}</p>
                </div>
                <div className={styles.friendActions}>
                  <Link href={`/profile/${friend.id}`} className={styles.viewButton}>
                    Profile
                  </Link>
                  <Link href={`/chat/${friend.id}`} className={styles.messageButton}>
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
